import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkipLink from './components/SkipLink';
import CookieBanner from './components/CookieBanner';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import IncomePage from './pages/IncomePage';
import InsulationPage from './pages/InsulationPage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';

const SERVICE_TITLE = 'Check if you can get a Green Home Grant - GOV.UK';

function App() {
  // TODO: Add form state here (useState) to hold all question answers
  // TODO: Pass state and setter to each page component via props

  useEffect(() => {
    document.title = SERVICE_TITLE;
  }, []);

  return (
    <>
      <SkipLink />
      <CookieBanner />
      <header>
        <GovukHeader />
        <PhaseBanner phase="Alpha" feedbackHref="#" />
      </header>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/property-type" element={<PropertyTypePage />} />
            <Route path="/ownership" element={<OwnershipPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/insulation" element={<InsulationPage />} />
            <Route path="/heating" element={<HeatingPage />} />
            <Route path="/check-answers" element={<CheckAnswersPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
