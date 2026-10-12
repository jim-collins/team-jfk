import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { questions } from './questions';
import SkipLink from './components/SkipLink';
import { focusElement } from './utils/focus';
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

const NO_ANSWERS = Object.fromEntries(questions.map((q) => [q.id, '']));

// Send someone who skips ahead (or reloads) to the first question they haven't answered.
// `before` is how many questions must be answered before this page can be shown.
function RequireAnswers({ answers, before, children }) {
  const missing = questions.slice(0, before).find((q) => !answers[q.id]);
  return missing ? <Navigate to={missing.path} replace /> : children;
}

function App() {
  // All answers live here, so they survive Back and Change.
  const [answers, setAnswers] = useState(NO_ANSWERS);
  const onAnswer = (id, value) => setAnswers((current) => ({ ...current, [id]: value }));

  // After each page change, move focus to the top of the page (so Tab reaches the skip link first)
  // and read out the new title through a live region.
  // Pages set their title in their own effects, which run before this one.
  const location = useLocation();
  const pageAnnouncer = useRef(null);
  const firstPage = useRef(true);
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    pageAnnouncer.current.textContent = document.title;
    focusElement(document.body);
  }, [location.key]);

  const page = (Page, before) => (
    <RequireAnswers answers={answers} before={before}>
      <Page answers={answers} onAnswer={onAnswer} />
    </RequireAnswers>
  );

  return (
    <>
      <div className="govuk-visually-hidden" aria-live="polite" ref={pageAnnouncer} />
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
            <Route path="/property-type" element={page(PropertyTypePage, 0)} />
            <Route path="/ownership" element={page(OwnershipPage, 1)} />
            <Route path="/income" element={page(IncomePage, 2)} />
            <Route path="/insulation" element={page(InsulationPage, 3)} />
            <Route path="/heating" element={page(HeatingPage, 4)} />
            <Route path="/check-answers" element={page(CheckAnswersPage, 5)} />
            <Route path="/result" element={page(ResultPage, 5)} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
