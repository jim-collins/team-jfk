import QuestionPage from '../components/QuestionPage';

function OwnershipPage({ answers, onAnswer }) {
  return <QuestionPage questionId="ownership" answers={answers} onAnswer={onAnswer} />;
}

export default OwnershipPage;
