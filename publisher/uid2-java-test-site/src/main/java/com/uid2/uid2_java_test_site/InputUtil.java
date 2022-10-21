package com.uid2.uid2_java_test_site;

public class InputUtil { //from https://github.com/IABTechLab/uid2-operator/blob/master/src/main/java/com/uid2/operator/service/InputUtil.java

  public static String normalizeEmailString(String email) {
    final StringBuilder preSb = new StringBuilder();
    final StringBuilder preSbSpecialized = new StringBuilder();
    final StringBuilder sb = new StringBuilder();
    StringBuilder wsBuffer = new StringBuilder();

    EmailParsingState parsingState = EmailParsingState.Starting;

    boolean inExtension = false;

    for (int i = 0; i < email.length(); ++i) {
      final char cGiven = email.charAt(i);
      final char c;

      if (cGiven >= 'A' && cGiven <= 'Z') {
        c = (char) (cGiven + 32);
      } else {
        c = cGiven;
      }

      switch (parsingState) {
        case Starting: {
          if (c == ' ') {
            break;
          }
        }
        case Pre: {
          if (c == '@') {
            parsingState = EmailParsingState.SubDomain;
          } else if (c == '.') {
            preSb.append(c);
          } else if (c == '+') {
            preSb.append(c);
            inExtension = true;
          } else {
            preSb.append(c);
            if (!inExtension) {
              preSbSpecialized.append(c);
            }
          }
          break;
        }
        case SubDomain: {
          if (c == '@') {
            return null;
          }
          if (c == ' ') {
            wsBuffer.append(c);
            break;
          }
          if (wsBuffer.length() > 0) {
            sb.append(wsBuffer.toString());
            wsBuffer = new StringBuilder();
          }
          sb.append(c);
        }
      }
    }
    if (sb.length() == 0) {
      return null;
    }
    final String domainPart = sb.toString();

    final String GMAILDOMAIN = "gmail.com";
    final StringBuilder addressPartToUse;
    if (GMAILDOMAIN.equals(domainPart)) {
      addressPartToUse = preSbSpecialized;
    } else {
      addressPartToUse = preSb;
    }
    if (addressPartToUse.length() == 0) {
      return null;
    }

    return addressPartToUse.append('@').append(domainPart).toString();
  }

  private static enum EmailParsingState {
    Starting,
    Pre,
    SubDomain,
    Domain,
    Terminal,
  }

  public static boolean isAsciiDigit(char d)
  {
    return d >= '0' && d <= '9';
  }

}


