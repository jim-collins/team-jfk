import QuestionPage from '../components/QuestionPage';

function IncomePage({ answers, onAnswer }) {
  return <QuestionPage questionId="incomeBand" answers={answers} onAnswer={onAnswer} />;
}

export default IncomePage;
