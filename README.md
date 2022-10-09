# tally ho x hopr integration

[Tally Ho](https://blog.tally.cash/a-community-owned-wallet-for-the-new-internet/)
is a community owned and operated Web3 wallet, built as a
[browser extension](https://browserext.github.io/browserext/).

## Quickstart Tally ho Extension

Try this.

```sh
$ nvm use
$ nvm install
$ npm install -g yarn # if you don't have yarn globally installed
$ yarn install # install all dependencies; rerun with --ignore-scripts if
               # scrypt node-gyp failures prevent the install from completing
$ yarn start # start a continuous webpack build that will auto-update with changes
```

Once the build is running, you can install the extension in your browser of choice:

- [Firefox instructions](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
- [Chrome, Brave, Edge, and Opera instructions](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest)
  - Note that these instructions are for Chrome, but substituting
    `brave://extensions` or `edge://extensions` or `opera://extensions` for `chrome://extensions`
    depending on browser should get you to the same buttons.

Extension bundles for each browser are in `dist/<browser>`.

By default, the `yarn start` command rebuilds the extension for each browser on
save. You can target a particular browser by specifying it in the command, e.g.
to only rebuild the Firefox extension on change:

```sh
# On change, rebuild the firefox extension but not others.
$ yarn start --config-name firefox
# On change, rebuild the firefox and brave extensions but not others.
$ yarn start --config-name firefox --config-name brave
```

#### Required Software

If you can't use the macOS setup script, here is the software you'll need to
install:

- `jq`: [Instructions](https://stedolan.github.io/jq/download/)
- `nvm`: [Instructions](https://github.com/nvm-sh/nvm#installing-and-updating)
- `pre-commit`: [Instructions](https://pre-commit.com/#install)

#### Installing pre-commit hooks

Before committing code to this repository or a fork/branch that you intend to
submit for inclusion, please make sure you've installed the pre-commit hooks
by running `pre-commit install`. The macOS setup script does this for you.

#### Local mainnet fork setup for development

For more detailed description see `./dev-utils/local-chain/README.md`

Quick Start:

```
$ cd dev-utils/local-chain
$ yarn install
$ yarn start
```


<a href="https://hosted.weblate.org/engage/tallycash/">
<img src="https://hosted.weblate.org/widgets/tallycash/-/extension/multi-auto.svg" alt="Translation status" />
</a>
