# Part A: Two Core Feature Improvements for Coy

Coy's core promise is simple: **you can add a crush in secret, and they only find out who added them if they add you back.**

During my walkthrough of Coy, I explored the home screen, account settings, invite-link functionality and extra-slots screen. I identified two opportunities to improve user engagement, referral conversion and the overall discovery experience while preserving Coy's privacy-first approach.

---

## Feature 1: Pending Crush Activation and Smart Invite Reminders

**What it is.**

Introduce a private pending-crush activation tracker for users who add someone who has not yet joined Coy.

When a user adds a crush using their phone number or email, Coy can indicate whether that person is already on the platform or whether they still need to join. For pending crushes, provide a privacy-safe invitation option with a pre-written message and a unique invite link.

The sender can see the invitation status, such as:

- Invitation not yet sent.
- Invitation sent.
- Invitation link opened.
- Crush joined Coy.

If the crush has not joined, Coy can offer an optional reminder after a reasonable interval. The reminder must never reveal the sender's identity or disclose whom they added as a crush.

**What I noticed.**

During my walkthrough, the home screen explained Coy's anonymous matching concept with the message, "We tell them someone likes them, not who." It also allowed users to add someone by phone number or email. In Settings, I found an invite-link option that users can copy. This made me think about improving the journey for users whose crushes have not joined Coy yet, so they have a clearer way to follow up without compromising privacy.

**Why it is needed**

- Coy's matching experience depends on both people joining the platform. A user may add a crush, but the experience can remain incomplete if that person never joins.
- A pending-crush tracker gives users visibility into the invitation journey instead of leaving them uncertain about what happens next.
- Pre-written invitation messages and optional reminders reduce the effort required to bring new users onto the platform.
- Tracking invitation progress can help Coy identify where users drop off and improve conversion from invitations to registrations.
- The feature supports Coy's privacy promise by keeping the sender's identity and crush activity confidential.

**Guardrails.**

- Never reveal the identity of the person who added the crush.
- Never disclose that a specific person has been added as someone's crush.
- Reminders must be optional and frequency-limited.
- Do not send repeated invitations without the user's consent.
- Do not expose phone numbers or email addresses in public profile information.
- Provide controls to stop reminders or cancel pending invitations.

**Success metric.**

Measure the percentage of pending crushes who join within 7 days of receiving an invitation, invitation-link engagement rate, and the conversion rate from pending crushes to mutual matches.

---

## Feature 2: Smarter Referral Progress and Reward Tracking

**What it is.**

Improve Coy's existing referral-based free-slot reward system by introducing a detailed referral progress tracker.

During my walkthrough, I observed that the extra-slots screen already provides paid packages and a free referral option. Users can invite three friends and receive one free crush slot when they join and add a crush. The screen currently displays progress as "0 of 3 joined" and provides options to copy or share the invite link.

I propose enhancing this existing system with individual referral progress, reward eligibility information and notifications.

For example, users could see:

- Friend 1 – Invitation sent.
- Friend 2 – Joined Coy.
- Friend 3 – Joined and added a crush.
- Reward – One free crush slot unlocked.

The progress tracker should clearly explain which actions are still required before a referral qualifies for a reward.

**What I noticed.**

The extra-slots screen displayed three paid packages: +1 crush for ₹49, +3 crushes for ₹129 and +5 crushes for ₹199. It also offered an alternative to invite three friends and receive one free slot when they join and add a crush. The referral section showed "0 of 3 joined" and provided both Copy link and Share link options. I found this referral option useful, but the screen could provide more detailed information about each referral's progress and when the free slot will be unlocked.

**Why it is needed**

- Users can understand their overall referral count more easily when individual referral progress is visible.
- Clear reward eligibility reduces confusion about why a referral has not yet qualified.
- Notifications when friends complete the required actions encourage users to continue participating in the referral programme.
- A transparent reward system can motivate users to invite more genuine users and help Coy grow organically.
- Retaining the existing paid packages alongside referral rewards gives users both paid and free ways to obtain additional crush slots.

**Guardrails.**

- Award a free slot only after the invited friend completes the required registration and crush-adding actions.
- Limit rewards to genuine, unique referrals.
- Prevent duplicate accounts and self-referrals from generating rewards.
- Clearly communicate referral eligibility and reward conditions.
- Never reveal private crush information through referral notifications.
- Keep the existing paid-slot purchase option available.

**Success metric.**

Measure referral-link conversion, the percentage of invited friends who complete the required actions, the number of free slots earned, and retention of users participating in the referral programme.

---

## Conclusion

Both improvements focus on strengthening Coy's existing user journey. The first helps users bring pending crushes onto the platform without compromising anonymity. The second improves transparency and engagement in Coy's existing referral reward system.

Together, these features aim to improve user activation, organic growth and retention while protecting Coy's central promise of private, mutual matching.