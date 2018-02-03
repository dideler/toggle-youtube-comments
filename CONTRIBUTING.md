Thank you very much for your interest in contributing.

Before you start, please take a moment to read this guide.

# Table of Contents

* [Goals](#goals)
* [Development](#development)
* [Test](#test)
* [Release](#release)

# Goals

Goals help us figure out what to work on, how to design the product,
what to say no to, and where we need help.

<dl>
  <dt>Just works</dt>
  <dd>Support all video pages on all YouTube versions. Recover from breaking changes as quickly as possible. Talk to users and listen to their feedback. Be transparent.</dd>

  <dt>Beautiful</dt>
  <dd>Blend in with YouTube's visual design. The UI should appear as if it were built by YouTube itself, rather than standing out as being added by a third party.</dd>

  <dt>User friendly</dt>
  <dd>Keep it simple, easy to use, and accessible to everyone. No instructions necessary. Software should be hard to build and easy to use, not the other way around.</dd>

  <dt>Lightweight</dt>
  <dd>We have earned the trust of every user. Respect them by using as little resources as possible on their machine. Favour focus over features. Never collect data without their consent.</dd>

  <dt>Avoid configuration</dt>
  <dd>Absorb complexity on behalf of users. Figure out what the user really wants and reduce the cognitive burden of making decisions. Anything added dilutes everything else.</dd>
</dl>

# Development

After you've forked and/or cloned the git repository, you'll
need to [load the extension into Chrome](https://developer.chrome.com/extensions/getstarted#unpacked).

During development, you'll want to make sure that the
extension continues to work on Old YouTube (OYT) and New
YouTube (NYT).

To switch from OYT to NYT, visit youtube.com/new.

To switch from NYT to OYT, go to your account menu at the top
right of the YouTube page and select "Restore old YouTube" (should
be the last option the list).

# Test

You'll need to manually test a few scenarios as the
project does not have automated acceptance tests yet.
This ensures that no regressions are introduced.

Many of the scenarios involve checking that the extension is
injected into the page properly on static and dynamic navigation,
and that the functionality works. Static navigation is traditional
navigation on the web, that is, the client sends a web request and
the server returns content and the whole page is then rendered).
Dynamic navigation is when a Single Page Application only updates
certain sections of the page and then re-renders the page.

Test scenarios:

* Toggle button appears when navigating from home page to a video
* Toggle button appears when navigating from a video to a video
* Toggle button does not appear when viewing a live video with chat

# Release

**Disclaimer:** _This section is solely for publishers of this extension on the Google Chrome Store.
Trusted collaborators can [apply to be added as a publisher](https://github.com/dideler/toggle-youtube-comments/issues/26#issuecomment-359970408)._

1. Bump version in a separate commit (use [semantic versioning](https://semver.org/))
1. Create git tag at version bump
1. Push version bump and tag
1. Create [release notes](../../releases)
1. Bundle the extension into a zip archive
1. Upload the bundle to the Chrome Web Store via the [Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)

There's a [Makefile](/Makefile) to help with some of these steps.
Run `make` in the project's root directory to see the supported commands.
