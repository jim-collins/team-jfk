function GovukButton({ children, onClick, type = 'button' }) {
  return (
    <button type={type} className="govuk-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default GovukButton;
