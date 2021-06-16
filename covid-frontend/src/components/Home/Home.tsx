import React, { useState } from "react";
import {
  Button,
  Dimmer,
  Header,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";

import { origin } from '../../common/get.origin';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const populateDb = () => {
    setIsLoading(true);
    fetch(`${origin}/populate`)
      .then(() => {
        setSuccess(true);
      })
      .catch(() => {
        setSuccess(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <Header as="h2" attached="top">
        Here you can populate the DB
      </Header>
      <Segment attached>
        <Dimmer inverted active={isLoading}>
          <Loader />
        </Dimmer>
        <Button onClick={populateDb}>Populate DB</Button>
        {success === true && <Message success content="DB populated" />}
        {success === false && <Message error content="DB was not populated" />}
      </Segment>
    </>
  );
};

export default Home;
