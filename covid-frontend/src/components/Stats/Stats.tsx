import React, { useEffect, useState } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import {
  Dimmer,
  Header,
  Icon,
  Loader,
  Segment,
  Statistic,
} from "semantic-ui-react";

import { origin } from "../../common/get.origin";

const Stats = () => {
  const [currentDate, setNewDate] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    countryStats: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading === false) {
      return;
    }

    const currentTimestamp = currentDate.setHours(23,59,59,999);

    Promise.all([
      fetch(`${origin}/stats/daily/${currentTimestamp}`),
      fetch(`${origin}/stats/country/${currentTimestamp}`),
    ])
      .then(([dailyStatsRes, countryStatsRes]) => {
        return Promise.all([dailyStatsRes.json(), countryStatsRes.json()]);
      })
      .then(([dailyStats, countryStats]) => {
        setIsLoading(false);
        setStats({ ...dailyStats, countryStats });
      });
  }, [currentDate, isLoading]);
  const handleOnChange = (event: any, data: any) => {
    setNewDate(data.value);
    setIsLoading(true);
  };

  return (
    <>
      <Header as="h2" attached="top">
        Here you can see the statisctics
      </Header>
      <Segment attached>
        <SemanticDatepicker
          datePickerOnly={true}
          clearable={false}
          clearOnSameDateClick={false}
          onChange={handleOnChange}
          value={currentDate}
        />
        <Segment>
          <Dimmer active={isLoading} inverted>
            <Loader />
          </Dimmer>
          <Statistic.Group>
            <Statistic>
              <Statistic.Value>
                <Icon name="stethoscope" />
                {stats.total}
              </Statistic.Value>
              <Statistic.Label>Total tests</Statistic.Label>
            </Statistic>

            <Statistic>
              <Statistic.Value>
                <Icon name="hospital" />
                {stats.positive}
              </Statistic.Value>
              <Statistic.Label>Positive</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <h3>Total tests per country</h3>
          <Statistic.Group>
            {stats.countryStats.map(({ _id, total }) => (
              <Statistic text key={_id}>
                <Statistic.Value>{_id}</Statistic.Value>
                <Statistic.Label>{total}</Statistic.Label>
              </Statistic>
            ))}
          </Statistic.Group>
        </Segment>
      </Segment>
    </>
  );
};

export default Stats;
