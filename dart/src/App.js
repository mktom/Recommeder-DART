import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams
} from 'react-router-dom'

import LoadingOverlay from 'react-loading-overlay';

// Pages
import HomePage from './pages/HomePage'
import CreateModelPage from './pages/CreateModelPage'
import ExportModelPage from './pages/ExportModelPage';
import ExportedModelsPage from './pages/ExportedModelsPage';
import RecommendationPage from './pages/RecommendationPage'
import FindPage from './pages/FindPage';
import NotFoundPage from './pages/NotFoundPage'
import RetrieveModelPage from './pages/RetrieveModelPage'
import DocumentationPage from './pages/DocoPage'
import NavBar from './NavBar'


// CSS
import './App.css'

function App() {
  const [overlay, setOverlay] = useState( false )
  const [overlayMsg, setOverlayMsg] = useState ('Loading ...')
  return (
    <LoadingOverlay active={ overlay } spinner text={ overlayMsg } >

    <Router>
      <NavBar />
      <div className="page-body">
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/create-model" component={ () => (<CreateModelPage setOverlay={ setOverlay } setOverlayMsg = { setOverlayMsg} />)} />
          <Route path="/retrieve-model" component={RetrieveModelPage} />
          <Route path="/export-model" component={ExportModelPage} />
          <Route path="/find-model" component={ () => (<FindPage setOverlay={ setOverlay } setOverlayMsg = { setOverlayMsg} />)}/>
          <Route path="/exported-models" component={ExportedModelsPage} />
          <Route path="/find" component={RecommendationPage} />
          <Route path="/doco" component={DocumentationPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
    </LoadingOverlay>

  )
}

export default App;
