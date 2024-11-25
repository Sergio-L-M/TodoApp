module.exports = {
    preset: "ts-jest", // Usa ts-jest para transformar archivos TypeScript
    testEnvironment: "jsdom", // Simula un entorno de navegador
    transformIgnorePatterns: [
      "node_modules/(?!axios)", // Asegúrate de que Jest procese axios y otros módulos ESM
    ],
    moduleNameMapper: {
      "\\.(css|scss|sass|less)$": "identity-obj-proxy", // Mock de estilos
    },
  };
  