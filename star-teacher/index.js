import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent memanggil AppRegistry.registerComponent agar hasil
// rendering dapat digunakan di lingkungan native maupun web.
registerRootComponent(App);
