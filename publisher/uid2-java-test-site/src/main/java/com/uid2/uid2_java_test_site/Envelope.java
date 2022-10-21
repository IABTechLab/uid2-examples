package com.uid2.uid2_java_test_site;


class Envelope {
  public Envelope(String envelope, byte[] nonce) {
    this.envelope = envelope;
    this.nonce = nonce;
  }

  public String getEnvelope() { return envelope; }
  public byte[] getNonce() { return nonce;}

  private final String envelope;
  private final byte[] nonce;
}


