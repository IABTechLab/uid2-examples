package com.uid2.uid2_java_test_site;

import io.vertx.core.json.JsonObject;

import java.time.Instant;

public class IdentityTokens {
  public IdentityTokens(String advertisingToken, String refreshToken, String refreshResponseKey, Instant identityExpires,
                        Instant refreshExpires, Instant refreshFrom, String jsonString) {
    this.advertisingToken = advertisingToken;
    this.refreshToken = refreshToken;
    this.identityExpires = identityExpires;
    this.refreshExpires = refreshExpires;
    //this.refreshExpires = refreshFrom.minusSeconds(1);
    this.refreshFrom = refreshFrom;
    this.refreshResponseKey = refreshResponseKey;
    this.jsonString = jsonString;
    //note we are intentionally skipping user_token as that is likely to be deprecated
  }

  static private Instant getInstant(JsonObject json, String key) {
    return Instant.ofEpochMilli(json.getLong(key));
  }

  static public IdentityTokens createFromJsonString(String jsonString) {
    return createFromJson(new JsonObject(jsonString));
  }

  static IdentityTokens createFromJson(JsonObject json) { //todo - keep as "default" access - exposes vertx Json, else need to change to another json dependency
    return new IdentityTokens(json.getString("advertising_token"), json.getString("refresh_token"), json.getString("refresh_response_key"),
      getInstant(json,"identity_expires"), getInstant(json, "refresh_expires"), getInstant(json, "refresh_from"), json.toString());
  }

  public boolean isRefreshable() {
    Instant refreshExpires = getRefreshExpires();

    if (refreshExpires == null || Instant.now().isAfter(refreshExpires)) {
      return false;
    }
    return getRefreshToken() != null;
  }

  public boolean isDueForRefresh() {
    return Instant.now().isAfter(getRefreshFrom()) || hasIdentityExpired();
  }

  public boolean hasIdentityExpired() {
    return Instant.now().isAfter(getIdentityExpires());
  }

  public String getAdvertisingToken() { return advertisingToken; }

  public String getRefreshToken() { return refreshToken; }
  public String getRefreshResponseKey() { return refreshResponseKey; }

  public Instant getIdentityExpires() { return identityExpires; }

  public Instant getRefreshExpires() {
    return refreshExpires;
  }

  public Instant getRefreshFrom() { return refreshFrom; }

  public String getJsonString() {return jsonString;} //this ensures we make newly added fields available, even before this class is updated.

  private final String advertisingToken;
  private final String refreshToken;
  private final String refreshResponseKey;
  private final Instant identityExpires;
  private final Instant refreshExpires;
  private final Instant refreshFrom;
  private final String jsonString;

}


