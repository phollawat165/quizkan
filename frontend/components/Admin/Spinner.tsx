const Spinner = (props) => (
    <>
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        <p className="text-muted">Loading...</p>
    </>
);

export default Spinner;
