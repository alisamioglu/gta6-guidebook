# Google Play Data safety answers

Play Console > Policy > App content > Data safety.
Based on what the app actually does: notes, photos and progress stay on the phone,
the only data that leaves the device is what Google AdMob collects for ads.

## Data collection and security

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (AdMob uses HTTPS) |
| Do you provide a way for users to request that their data is deleted? | **No** (we don't keep any user data; uninstalling the app removes everything on the device) |

## Data types

Only tick these. Everything else stays unticked.

### Device or other IDs
- **Collected:** Yes · **Shared:** Yes
- **Processed ephemerally:** No
- **Required or optional:** Required (users can limit it in phone settings / consent form)
- **Purposes:** Advertising or marketing, Analytics, Fraud prevention, security, and compliance

### Location > Approximate location
- **Collected:** Yes · **Shared:** Yes
- **Processed ephemerally:** No
- **Required or optional:** Required
- **Purposes:** Advertising or marketing, Analytics, Fraud prevention, security, and compliance
- (AdMob derives it from the IP address, the app never asks for location permission)

### App activity > App interactions
- **Collected:** Yes · **Shared:** Yes
- **Processed ephemerally:** No
- **Required or optional:** Required
- **Purposes:** Advertising or marketing, Analytics

### App info and performance > Diagnostics
- **Collected:** Yes · **Shared:** Yes
- **Processed ephemerally:** No
- **Required or optional:** Required
- **Purposes:** Analytics, Fraud prevention, security, and compliance

## Not collected (leave unticked)

- **Photos and videos:** photos added to pins are only stored on the device, never sent anywhere
- **Personal info** (name, email, address, etc.): no accounts
- **Financial info:** purchases are handled by Google Play, we never see payment details
- **Precise location, messages, contacts, calendar, health, files, audio, web browsing:** not used

## Other App content forms

- **Ads:** Yes, the app contains ads
- **Target audience:** 13+ (not designed for children)
- **Content rating questionnaire:** reference app, no violence, no user generated content shared with others, ads present
- **Government apps / News apps / Financial features / Health:** No
