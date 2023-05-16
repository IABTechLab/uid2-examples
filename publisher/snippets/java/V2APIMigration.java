import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;

public class V2APIMigration {

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.out.println("usage: this <base64-client-key> <base64-client-secret>");
            return;
        }
        final String clientKey = args[0];
        final String clientSecret = args[1];
        ExampleTokenGeneration(clientKey, clientSecret);
        ExampleIdentityMap(clientKey, clientSecret);
    }

    public static void ExampleTokenGeneration(String apiKey, String secretKey) throws Exception {
        // documentation: https://unifiedid.com/docs/endpoints/post-token-generate
        String rawData = "{\"email\": \"username@example.com\"}";
        V2Request request = makeV2Request(Instant.now(), rawData.getBytes(StandardCharsets.UTF_8), Base64.getDecoder().decode(secretKey));
        final URL endpoint = new URL("https://operator-integ.uidapi.com/v2/token/generate");
        sendV2Request(request, endpoint, apiKey, secretKey);
    }

    public static void ExampleIdentityMap(String apiKey, String secretKey) throws Exception {
        // documentation: https://unifiedid.com/docs/endpoints/post-identity-map
        String rawData = "{\"email\": [\"username1@example.com\", \"username2@example.com\", \"username3@example.com\"]}";
        V2Request request = makeV2Request(Instant.now(), rawData.getBytes(StandardCharsets.UTF_8), Base64.getDecoder().decode(secretKey));
        final URL endpoint = new URL("https://operator-integ.uidapi.com/v2/identity/map");
        sendV2Request(request, endpoint, apiKey, secretKey);
    }

    private static void sendV2Request(V2Request request, URL endpoint, String apiKey, String secretKey) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) endpoint.openConnection();
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "bearer " + apiKey);
        conn.getOutputStream().write(request.envelope);
        int status = conn.getResponseCode();
        if (status == 200) {
            final InputStream inputStream = conn.getInputStream();
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int bytesRead;
            byte[] data = new byte[4096];
            while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, bytesRead);
            }
            byte[] responsePayload = decryptV2Response(buffer.toByteArray(), request.nonce, Base64.getDecoder().decode(secretKey));
            System.out.println(new String(responsePayload, StandardCharsets.UTF_8));
        } else {
            throw new RuntimeException("bad status code " + status);
        }
    }

    public static V2Request makeV2Request(Instant now, byte[] payload, byte[] secretKey) {
        byte[] nonce = new byte[8];
        new SecureRandom().nextBytes(nonce);
        ByteBuffer writer = ByteBuffer.allocate(16 + payload.length);
        writer.putLong(now.toEpochMilli());
        writer.put(nonce);
        writer.put(payload);
        byte[] encrypted = encryptGCM(writer.array(), null, secretKey);
        ByteBuffer request = ByteBuffer.allocate(encrypted.length + 1);
        request.put((byte)1);
        request.put(encrypted);
        return new V2Request(Base64.getEncoder().encode(request.array()), nonce);
    }

    private static byte[] decryptV2Response(byte[] envelope, byte[] nonce, byte[] secretKey) {
        final byte[] envelopeBytes = Base64.getDecoder().decode(envelope);
        final byte[] payload = decryptGCM(envelopeBytes, 0, secretKey);
        final byte[] receivedNonce = Arrays.copyOfRange(payload, 8, 8 + nonce.length);
        if (!Arrays.equals(receivedNonce, nonce)) {
            throw new IllegalStateException("nonce mismatch");
        }
        return Arrays.copyOfRange(payload, 16, payload.length);
    }

    private static final int GCM_AUTHTAG_LENGTH = 16;
    private static final int GCM_IV_LENGTH = 12;
    private static byte[] encryptGCM(byte[] b, byte[] iv, byte[] secretBytes) {
        try {
            final SecretKey k = new SecretKeySpec(secretBytes, "AES");
            final Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            if (iv == null) {
                iv = new byte[GCM_IV_LENGTH];
                new SecureRandom().nextBytes(iv);
            }
            GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_AUTHTAG_LENGTH * 8, iv);
            c.init(Cipher.ENCRYPT_MODE, k, gcmParameterSpec);
            ByteBuffer buffer = ByteBuffer.allocate(b.length + GCM_IV_LENGTH + GCM_AUTHTAG_LENGTH);
            buffer.put(iv);
            buffer.put(c.doFinal(b));
            return buffer.array();
        } catch (Exception e) {
            throw new RuntimeException("unable to encrypt", e);
        }
    }

    private static byte[] decryptGCM(byte[] encryptedBytes, int offset, byte[] secretBytes) {
        try {
            final SecretKey k = new SecretKeySpec(secretBytes, "AES");
            final GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(GCM_AUTHTAG_LENGTH * 8, encryptedBytes, offset, GCM_IV_LENGTH);
            final Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.DECRYPT_MODE, k, gcmParameterSpec);
            return c.doFinal(encryptedBytes, offset + GCM_IV_LENGTH, encryptedBytes.length - offset - GCM_IV_LENGTH);
        } catch (Exception e) {
            throw new RuntimeException("unable to decrypt", e);
        }
    }

    private static class V2Request {
        public final byte[] envelope;
        public final byte[] nonce;

        public V2Request(byte[] envelope, byte[] nonce) {
            this.envelope = envelope;
            this.nonce = nonce;
        }
    }
}