import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const elementMessage = (error: unknown): React.ReactNode => {
    if (isRouteErrorResponse(error)) {
      return (
        <i>
          {error.status} {error.statusText}
        </i>
      );
    }

    if (error instanceof Error) {
      return <i>{error.message}</i>;
    }

    return <i>Unknown Error!</i>;
  };

  return (
    <>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>{elementMessage(error)}</p>
      </div>
    </>
  );
};

export default ErrorPage;
