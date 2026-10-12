import QuestionPage from '../components/QuestionPage';

function HeatingPage({ answers, onAnswer }) {
  return <QuestionPage questionId="heating" answers={answers} onAnswer={onAnswer} />;
}

export default HeatingPage;
