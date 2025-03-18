// ***********************************************************
// This is support file for component testing
// ***********************************************************

import './commands';

// Import testing library commands
import '@testing-library/cypress/add-commands';

// Cypress component testing
import { mount } from 'cypress/react18';

// Add mount command
Cypress.Commands.add('mount', mount);

// Declare global Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
} 