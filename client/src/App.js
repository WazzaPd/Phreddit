// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import Phreddit from './components/phreddit.js'
import {AuthProvider} from './context/AuthProvider.js'

function App() {
  return (
    <AuthProvider>
      <section className="phreddit">
        <Phreddit />
      </section>
    </AuthProvider>
  );
}

export default App;
