# Uploading STELR EV to GitHub and MakeCode

This package was built locally. Nothing has been uploaded to your GitHub repository.

## 1. Upload the extension

1. Unzip STELR-EV-0.1.0.zip and open the STELR-EV folder.
2. Sign into GitHub and open https://github.com/STELR-ATSE/STELR-EV.
3. Choose Add file → Upload files. An empty repository may instead show an “uploading an existing file” link.
4. Drag the CONTENTS of the extracted folder into the upload area, preserving the subfolders. Do not upload the ZIP itself or create another STELR-EV folder inside the repository.
5. Commit with a message such as “Add first STELR EV hardware extension”. If the repository already contains changes, compare them before replacing files.

At the top level you should see pxt.json, motors.ts, gamepad.ts, distance.ts, README.md, test.ts, the licence files and the supporting folders. pxt.json must be at the repository root.

## 2. Open it in MakeCode

1. Open https://makecode.microbit.org and sign in with GitHub when prompted.
2. Use Import → Import URL with https://github.com/STELR-ATSE/STELR-EV to open the extension repository as an authoring project. For a private repository this requires authorised access; the URL alone does not grant access.
3. Create a separate project for testing. Under Extensions, try the repository URL while signed in. If private repository access is not offered by that editor session, use MakeCode’s local extension testing workflow from its GitHub authoring guide, rather than changing visibility just to bypass the problem.
4. Install the extension, paste examples/01-motor.ts into the JavaScript editor of the test project, and switch to Blocks. Test the other examples separately on the appropriate hardware.

Do not download the root test.ts coverage project to a robot. Use the small examples in separate projects.

## 3. Share with schools after testing

Keep the repository private during development if you prefer. For straightforward installation by schools using the repository URL, deliberately make the extension repository public once its contents and hardware behaviour have been reviewed. Changing visibility makes all repository contents and history public.

Complete docs/HARDWARE_CHECKLIST.md first. Then create a versioned release using MakeCode’s GitHub release controls. The initial package version is 0.1.0; use an appropriate matching release tag such as v0.1.0. Later changes should receive a new version and release. Existing student projects can remain pinned to an older version until updated.

Students can add a public extension using its repository URL without it appearing in the searchable gallery. Gallery approval is a separate process.

## Updating later

Edit the source in MakeCode’s GitHub authoring project or upload revised files through GitHub. Commit changes, test with a separate project, then publish the next versioned release when ready. Keep calibration and vehicle programs in separate projects rather than adding them to the hardware extension.

Official guidance:
- https://makecode.com/extensions/github-authoring
- https://makecode.com/extensions/versioning
