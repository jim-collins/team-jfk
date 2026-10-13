import { useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { questions } from './questions';
import { usePageChangeFocus } from './utils/usePageChangeFocus';
import SkipLink from './components/SkipLink';
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
  const clearAnswers = () => setAnswers(NO_ANSWERS);

  const pageAnnouncer = useRef(null);
  usePageChangeFocus(pageAnnouncer);

  // Every page after the start needs the questions before it answered.
  const guarded = (before, element) => (
    <RequireAnswers answers={answers} before={before}>
      {element}
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
              // QuestionPage's key: a new question starts fresh rather than reusing the last one's state
              <Route
                key={q.id}
                path={q.path}
                element={guarded(index, <QuestionPage key={q.id} question={q} index={index} answers={answers} onAnswer={onAnswer} />)}
              />
            ))}
            <Route path="/check-answers" element={guarded(questions.length, <CheckAnswersPage answers={answers} />)} />
            <Route path="/result" element={guarded(questions.length, <ResultPage answers={answers} onStartAgain={clearAnswers} />)} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
