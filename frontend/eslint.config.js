import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
    ],
  },
  ...nextVitals,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
];

export default eslintConfig;
