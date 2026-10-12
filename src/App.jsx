import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { questions } from './questions';
import SkipLink from './components/SkipLink';
import { focusElement } from './utils/focus';
import CookieBanner from './components/CookieBanner';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import QuestionPage from './components/QuestionPage';
import StartPage from './pages/StartPage';
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
  // Only a new path or query counts: not the first load (StrictMode runs effects twice) or a '#' link.
  const location = useLocation();
  const pageAddress = location.pathname + location.search;
  const pageAnnouncer = useRef(null);
  const lastPageAddress = useRef(pageAddress);
  useEffect(() => {
    if (lastPageAddress.current === pageAddress) return;
    lastPageAddress.current = pageAddress;
    pageAnnouncer.current.textContent = document.title;
    focusElement(document.body);
  }, [pageAddress]);

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
            {questions.map((q, index) => (
              <Route
                key={q.id}
                path={q.path}
                element={
                  <RequireAnswers answers={answers} before={index}>
                    {/* key: a new question starts fresh rather than reusing the last one's state */}
                    <QuestionPage key={q.id} questionId={q.id} answers={answers} onAnswer={onAnswer} />
                  </RequireAnswers>
                }
              />
            ))}
            <Route path="/check-answers" element={page(CheckAnswersPage, questions.length)} />
            <Route path="/result" element={page(ResultPage, questions.length)} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
