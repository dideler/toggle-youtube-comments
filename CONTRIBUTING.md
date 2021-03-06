Thank you very much for your interest in contributing.

Before you start, please take a moment to read this guide.

# Table of Contents

* [Goals](#goals)
* [Development](#development)
* [Test](#test)
* [Release](#release)
* [Admin & Monitoring](#admin--monitoring)

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

After you've cloned the git repository, you'll need to
[load the unpacked extension into Chrome](https://developer.chrome.com/extensions/getstarted#manifest).  
Choose the project's `src` directory as the extension's directory, as it contains the manifest file.

During development, make sure that the extension continues to
work on Old YouTube (OYT) and New YouTube (NYT).

- To switch from OYT to NYT, visit [youtube.com/new](https://youtube.com/new).

- To switch from NYT to OYT, [refer to the latest steps](https://github.com/dideler/toggle-youtube-comments/issues/7#issuecomment-450763039).

# Test

You'll need to manually test a few scenarios as the
project does not have automated acceptance tests yet.
This ensures that no regressions are introduced.

Many of the scenarios involve checking that the extension is
injected into the page properly on _static_ and _dynamic_ navigation,
and that the functionality works.

Static (hard) navigation is traditional navigation on the web.
The full page is requested by the client and returned by the server.

Dynamic (soft) navigation is when a Single Page Application updates
certain sections or components of the page to make it look like a
new page. Such navigation can be done client-side. Even though
the page path may change, the page was not requested from a server.
Note that web requests to a server may still occur to fetch content.

Test scenarios:

* Toggle button appears when hard navigating to a video
* Toggle button appears when navigating from home page to a video
* Toggle button appears when navigating from a video to a video
* Toggle button does not appear when viewing a live video with chat

# Release

**Disclaimer:** _This section is solely for publishers of this extension on the Google Chrome Store.
Trusted collaborators can [apply to be added as a publisher](https://github.com/dideler/toggle-youtube-comments/issues/26#issuecomment-359970408)._

1. Install/update build dependencies with `npm install`
1. Bump version using [npm-version](https://docs.npmjs.com/cli/version), e.g. `npm version patch`
   - Creates a version commit and an annotated tag, then pushes both to GitHub
   - Copies a [template for release notes](https://github.com/dideler/toggle-youtube-comments/issues/27#issuecomment-360982010) to the clipboard
   - Note the project uses [semantic versioning](https://semver.org/)
1. Create [release notes](../../releases) on GitHub
   - Recommended to use the template from the previous step
1. Build the extension package with `npm run build`
   - Creates distributable files in the local `_dir` directory
   - Creates a new release in the local `_packages` directory
1. Upload the zipped package of the release to the Chrome Web Store via the [Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)

You can view all scripts with `npm run`.

Releases with signficant visual changes should use new images on the Chrome Web Store.  
Please [upload a copy of the images to GitHub](../../issues/32).

# Admin & Monitoring

**Disclaimer:** _This section is solely for publishers of this extension on the Google Chrome Store.
Trusted collaborators can [apply to be added as a publisher](https://github.com/dideler/toggle-youtube-comments/issues/26#issuecomment-359970408)._

- [Developer dashboard](https://chrome.google.com/webstore/developer/dashboard/uafb8833e0e606a462093ebe52d5eda3d)
- [Recent stats](https://chrome.google.com/webstore/developer/stats/ampjnmipdgicjjidohpkidhghakoidfm)
- [Recent reviews](https://chrome.google.com/webstore/detail/toggle%C2%A0youtube%C2%A0comments/ampjnmipdgicjjidohpkidhghakoidfm/reviews)
