import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button,
  withStyles,
  LinearProgress,
  Switch,
  FormGroup,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  ExposedPopulationResult,
  BaselineLayerResult,
} from '../../../utils/analysis-utils';
import { dateRangeSelector } from '../../../context/mapStateSlice/selectors';
import {
  isDataTableDrawerActiveSelector,
  ExposedPopulationDispatchParams,
  requestAndStoreExposedPopulation,
  isExposureAnalysisLoadingSelector,
  clearAnalysisResult,
  setIsDataTableDrawerActive,
  setCurrentDataDefinition,
  analysisResultSelector,
} from '../../../context/analysisResultStateSlice';
import {
  LayerType,
  AggregationOperations,
  LayerKey,
  ExposedPopulationDefinition,
} from '../../../config/types';
import { TableDefinitions } from '../../../config/utils';
import { Extent } from '../Layers/raster-utils';
import { useUrlHistory, AnalysisType } from '../../../utils/url-utils';

const AnalysisButton = withStyles(() => ({
  root: {
    marginTop: '1em',
    marginBottom: '1em',
    fontSize: '0.7em',
  },
}))(Button);

const AnalysisFormControlLabel = withStyles(() => ({
  label: {
    color: 'black',
  },
}))(FormControlLabel);

const ExposedPopulationAnalysis = ({
  result,
  id,
  extent,
  exposure,
}: AnalysisProps) => {
  const { startDate: selectedDate } = useSelector(dateRangeSelector);
  const isDataTableDrawerActive = useSelector(isDataTableDrawerActiveSelector);
  const analysisExposureLoading = useSelector(
    isExposureAnalysisLoadingSelector,
  );

  const dispatch = useDispatch();
  const { urlParams, updateHistory, clearAnalysisFromUrl } = useUrlHistory();

  const runExposureAnalysis = useCallback(async () => {
    if (!id || !extent || !exposure) {
      return;
    }

    if (!selectedDate) {
      throw new Error('Date must be given to run analysis');
    }

    const params: ExposedPopulationDispatchParams = {
      exposure,
      date: selectedDate,
      statistic: AggregationOperations.Sum,
      extent,
      wfsLayerId: id as LayerKey,
    };

    await dispatch(requestAndStoreExposedPopulation(params));
  }, [selectedDate, dispatch, exposure, extent, id]);

  useEffect(() => {
    const { analysis } = urlParams;

    if (result || !analysis || analysis !== AnalysisType.Exposure) {
      return;
    }

    runExposureAnalysis();
  }, [result, urlParams, runExposureAnalysis]);

  const ResultSwitches = () => {
    const data = useSelector(analysisResultSelector);
    const features = data?.featureCollection.features;
    const hasData = features?.length === 0;

    const handleTableViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setIsDataTableDrawerActive(e.target.checked));
      dispatch(
        setCurrentDataDefinition({
          id: TableDefinitions.animal_deaths.id,
          title: data?.getTitle() || '',
          table: '',
          legendText: data?.legendText || '',
        }),
      );
    };

    return (
      <>
        <FormGroup>
          <AnalysisFormControlLabel
            control={
              <Switch
                color="primary"
                disabled={hasData}
                checked={isDataTableDrawerActive}
                onChange={handleTableViewChange}
              />
            }
            label="Table view"
          />
        </FormGroup>

        {hasData && (
          <Grid item>
            <Typography align="center" variant="h5">
              No population was exposed
            </Typography>
          </Grid>
        )}
      </>
    );
  };

  if (!result || result instanceof BaselineLayerResult) {
    return (
      <>
        <AnalysisButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => updateHistory({ analysis: AnalysisType.Exposure })}
        >
          Exposure Analysis
        </AnalysisButton>

        {analysisExposureLoading && <LinearProgress />}
      </>
    );
  }

  return (
    <>
      <AnalysisButton
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => {
          clearAnalysisFromUrl();
          dispatch(clearAnalysisResult());
        }}
      >
        clear analysis
      </AnalysisButton>

      <ResultSwitches />
    </>
  );
};

interface AnalysisProps {
  result: ExposedPopulationResult;
  id: LayerType['id'];
  extent: Extent;
  exposure: ExposedPopulationDefinition;
}

export default ExposedPopulationAnalysis;
