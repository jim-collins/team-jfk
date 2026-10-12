import QuestionPage from '../components/QuestionPage';

function PropertyTypePage({ answers, onAnswer }) {
  return <QuestionPage questionId="propertyType" answers={answers} onAnswer={onAnswer} />;
}

export default PropertyTypePage;
