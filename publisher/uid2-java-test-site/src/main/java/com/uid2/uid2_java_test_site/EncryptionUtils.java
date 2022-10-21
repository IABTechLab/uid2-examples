package com.uid2.uid2_java_test_site;

import com.uid2.client.Decryption;
import io.vertx.core.json.JsonObject;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;

public class EncryptionUtils {

  public static Envelope createEnvelope(String base64SecretKey, String jsonToEncrypt) {
    final byte[] secretKey = base64ToByteArray(base64SecretKey); //todo, this should be done and stored once, as a member

    byte[] jsonEmailBytes = jsonToEncrypt.getBytes(StandardCharsets.UTF_8);

    //from makeV2Request
    final int nonceLength = 8;
    byte[] nonce = new byte[nonceLength];
    new SecureRandom().nextBytes(nonce); //todo, SecureRandom() should be a member and re-used
    ByteBuffer writer = ByteBuffer.allocate(TIMESTAMP_LENGTH + nonceLength + jsonEmailBytes.length);
    writer.putLong(Instant.now().toEpochMilli());
    writer.put(nonce);
    writer.put(jsonEmailBytes);

    byte[] encrypted = Decryption.encryptGCM(writer.array(), null, secretKey);
    ByteBuffer envelopeBuffer = ByteBuffer.allocate(encrypted.length + 1);
    final byte envelopeVersion = 1;
    envelopeBuffer.put(envelopeVersion);
    envelopeBuffer.put(encrypted);
    return new Envelope(byteArrayToBase64(envelopeBuffer.array()), nonce);
  }

  public static IdentityTokens createIdentityfromTokenGenerateResponse(String response, byte[] nonce, String base64SecretKey) {
    String identityJsonString = decrypt(response, base64SecretKey, false, nonce);
    JsonObject jsonIdentity = new JsonObject(identityJsonString);

    if (!"success".equals(jsonIdentity.getString("status"))) {
      throw new RuntimeException("Got unexpected token generate status in decrypted response:\n" + jsonIdentity.encodePrettily());
    }

    return IdentityTokens.createFromJson(getBodyAsJson(jsonIdentity));
  }

  public static IdentityTokens createIdentityFromTokenRefreshResponse(String encryptedResponse, IdentityTokens currentIdentity) {
    String response;
    String refreshResponseKey = currentIdentity.getRefreshResponseKey();
    if (refreshResponseKey != null) {
      response = EncryptionUtils.decrypt(encryptedResponse, refreshResponseKey, true, null);
    } else { //if refresh_response_key doesn't exist, assume refresh_token came from a v1/token/generate query. In that scenario, /v2/token/refresh will return an unencrypted response.
      response = encryptedResponse;
    }

    JsonObject responseJson = new JsonObject(response);
    String status = responseJson.getString("status");

    if ("optout".equals(status)) {
      return null;
    } else if (!"success".equals(status)) {
      throw new RuntimeException("Got unexpected token refresh status: " + status);
    }

    IdentityTokens refreshedIdentity = IdentityTokens.createFromJson(getBodyAsJson(responseJson));
    if (!refreshedIdentity.isRefreshable() || refreshedIdentity.hasIdentityExpired()) {
      throw new RuntimeException("Invalid identity in token refresh response: " + response);
    }

    return refreshedIdentity;
  }



  public static String decrypt(String response, String base64SecretKey, boolean isRefreshResponse, byte[] nonceInRequest)
  {
    byte[] secretKey = base64ToByteArray(base64SecretKey);

    //from parseV2Response
    byte[] responseBytes = base64ToByteArray(response);
    byte[] payload = Decryption.decryptGCM(responseBytes, 0, secretKey);

    byte[] resultBytes;
    if (!isRefreshResponse) {
      byte[] nonceInResponse = Arrays.copyOfRange(payload, TIMESTAMP_LENGTH, TIMESTAMP_LENGTH + nonceInRequest.length);
      if (!Arrays.equals(nonceInResponse, nonceInRequest)) {
        throw new IllegalStateException("Nonce in request does not match nonce in response");
      }
      resultBytes = Arrays.copyOfRange(payload, TIMESTAMP_LENGTH + nonceInRequest.length, payload.length);
    }
    else {
      resultBytes = payload;
    }
    return new String(resultBytes, StandardCharsets.UTF_8);
  }

  public static String getBase64EncodedHash(String input) {
    return byteArrayToBase64(getSha256Bytes(input));
  }

  private static byte[] getSha256Bytes(String input) {
    try {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      md.update(input.getBytes());
      return md.digest();
    } catch (Exception e) {
      throw new RuntimeException("Trouble Generating SHA256", e);
    }
  }

  static String createJsonRequestForGenerateToken(IdentityType identityType, String value) {
    switch (identityType) {
      case Email:
        return new JsonObject().put("email", value).toString();
      case Phone:
        return new JsonObject().put("phone", value).toString();
    }
    throw new RuntimeException("unknown identityType " + identityType);
  }

  static String createHashedJsonRequestForGenerateToken(IdentityType identityType, String unhashedValue) {
    switch (identityType) {
      case Email:
        String normalizedEmail = InputUtil.normalizeEmailString(unhashedValue);
        if (normalizedEmail == null)
          return null; //todo exception/error
        String hashedNormalizedEmail = EncryptionUtils.getBase64EncodedHash(normalizedEmail);
        return new JsonObject().put("email_hash", hashedNormalizedEmail).toString();
      case Phone:
        if (!isPhoneNumberNormalized(unhashedValue))


          return new JsonObject().put("phone_hash", unhashedValue).toString(); //todo: check Normalized & hash
    }
    throw new RuntimeException("unknown identityType " + identityType);
  }

    public static boolean isAsciiDigit(char d)
    {
      return d >= '0' && d <= '9';
    }

    public static boolean isPhoneNumberNormalized(String phoneNumber) { //from https://github.com/IABTechLab/uid2-operator/blob/14de3733e72f72adf1d9af7091dee03ea9cdb5b2/src/main/java/com/uid2/operator/service/InputUtil.java#L80
      final int MIN_PHONENUMBER_DIGITS = 10;
      final int MAX_PHONENUMBER_DIGITS = 15;

      // normalized phoneNumber must follow ITU E.164 standard, see https://www.wikipedia.com/en/E.164
      if (phoneNumber == null || phoneNumber.length() < MIN_PHONENUMBER_DIGITS)
        return false;

      // first character must be '+' sign
      if ('+' != phoneNumber.charAt(0))
        return false;

      // count the digits, return false if non-digit character is found
      int totalDigits = 0;
      for (int i = 1; i < phoneNumber.length(); ++i)
      {
        if (!InputUtil.isAsciiDigit(phoneNumber.charAt(i)))
          return false;
        ++totalDigits;
      }

      return totalDigits >= MIN_PHONENUMBER_DIGITS && totalDigits <= MAX_PHONENUMBER_DIGITS;
    }

  private static JsonObject getBodyAsJson(JsonObject jsonResponse) {
    return jsonResponse.getJsonObject("body");
  }

  private static byte[] base64ToByteArray(String str) { return Base64.getDecoder().decode(str); }
  private static String byteArrayToBase64(byte[] b) { return Base64.getEncoder().encodeToString(b); }

  private static final int TIMESTAMP_LENGTH = 8;
}



