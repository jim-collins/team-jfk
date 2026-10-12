import QuestionPage from '../components/QuestionPage';

function InsulationPage({ answers, onAnswer }) {
  return <QuestionPage questionId="insulation" answers={answers} onAnswer={onAnswer} />;
}

export default InsulationPage;
