# Changelog

## [0.2.0](https://github.com/juninmd/gign/compare/gign-v0.1.0...gign-v0.2.0) (2026-10-15)

### Features

- add detection and ignore rules for modern tools ([#226](https://github.com/juninmd/gign/issues/226)) ([4969c96](https://github.com/juninmd/gign/commit/4969c96ff8fd68fcae28a9f87ea0539eab0e0870))
- add detection and ignore rules for new tools\n\nAdds Hathora, Zeabur, Coolify, and Kpt configurations to `pattern.json` and `manual.json` to automatically detect them and ignore their cache/build output directories. ([#227](https://github.com/juninmd/gign/issues/227)) ([ccee39e](https://github.com/juninmd/gign/commit/ccee39e83801d55f82aac7faac4af7b769a7ca87))
- Add detection and ignore rules for Ruby, Rails, Django, Terraform, Docker, and Elixir ([#228](https://github.com/juninmd/gign/issues/228)) ([ba49013](https://github.com/juninmd/gign/commit/ba49013a860ff59a85dbc3824c21fe2f10def623))
- add detection patterns for more modern tools ([#221](https://github.com/juninmd/gign/issues/221)) ([3ea088d](https://github.com/juninmd/gign/commit/3ea088de8610e18e2670299f63fb382771f09453))
- add ignore patterns for modern tools ([#229](https://github.com/juninmd/gign/issues/229)) ([5997f84](https://github.com/juninmd/gign/commit/5997f84ded9c584c8ab6e973b2a6ea88b599b224))
- add missing patterns and manual ignore rules for modern tools ([#224](https://github.com/juninmd/gign/issues/224)) ([7859bd3](https://github.com/juninmd/gign/commit/7859bd349b9a5817498a0d4628f344c710110abb))
- add new patterns and cache directories for modern tools in manual.json and pattern.json ([#225](https://github.com/juninmd/gign/issues/225)) ([568be2c](https://github.com/juninmd/gign/commit/568be2c6c5004c2a7d54b20b3073f8c3d337fd1d))
- add new patterns and detection for various modern tools in .gitignore generation\n\n- Expanded pattern.json to map modern tools to the node tag (e.g., eslint config variants, biome, bun, uv, swc)\n- Extended manual.json to add explicit paths to ignore for generated artifacts or cache directories for the aforementioned tools\n- Ensured both files remain properly formatted and structurally valid ([#230](https://github.com/juninmd/gign/issues/230)) ([90afba4](https://github.com/juninmd/gign/commit/90afba4984b8c6836ffdc77c343abc78edc1e714))
- add patterns for Traefik, Wasp, Remotion, and Pipenv ([#231](https://github.com/juninmd/gign/issues/231)) ([eff3cb0](https://github.com/juninmd/gign/commit/eff3cb0eb032ce29e5d11a48d0f0c4dd98a35ef5))
- Add support for TanStack Router, Orval, MSW, and GraphQL YAML configs ([#223](https://github.com/juninmd/gign/issues/223)) ([b8114f4](https://github.com/juninmd/gign/commit/b8114f48001819d9b825936621ada7b342492487))

## [0.1.0](https://github.com/juninmd/gign/compare/gign-v0.0.3...gign-v0.1.0) (2026-10-05)

### Features

- add detection patterns and ignore rules for modern tools ([#219](https://github.com/juninmd/gign/issues/219)) ([9c23f5a](https://github.com/juninmd/gign/commit/9c23f5ad010f778f96f7ce2a1023e9ef8cf17a2e))
- bundle gitignore templates offline and publish to npm on release ([#216](https://github.com/juninmd/gign/issues/216)) ([96567a9](https://github.com/juninmd/gign/commit/96567a9ddadb301b55f01e72f703c59c1ecd0b26))
