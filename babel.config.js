module.exports = api => {
  api.cache(() => process.env.NODE_ENV);

  const presets = [
    [
      "@babel/preset-env",
      {
        exclude: ["@babel/plugin-transform-typeof-symbol"]
      }
    ]
  ];
  const plugins = ["@babel/plugin-transform-runtime"];

  return {
    sourceType: "script",
    presets,
    plugins
  };
};
