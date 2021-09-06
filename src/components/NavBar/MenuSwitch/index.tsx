import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  createStyles,
  Grid,
  Switch,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {
  LayersCategoryType,
  LayerType,
  TableType,
} from '../../../config/types';
import { removeLayer } from '../../../context/mapStateSlice';
import { loadTable } from '../../../context/tableStateSlice';
import { layersSelector } from '../../../context/mapStateSlice/selectors';
import { useUrlHistory } from '../../../utils/url-utils';

function MenuSwitch({ classes, title, layers, tables }: MenuSwitchProps) {
  const selectedLayers = useSelector(layersSelector);
  const dispatch = useDispatch();
  const { updateHistory, clearHistory } = useUrlHistory();

  const toggleLayerValue = (layer: LayerType) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target;
    if (checked) {
      updateHistory({
        [layer.type === 'nso' ? 'baselineLayerId' : 'hazardLayerId']: layer.id,
      });
    } else {
      clearHistory();
      dispatch(removeLayer(layer));
    }
  };

  const showTableClicked = (table: TableType) => {
    dispatch(loadTable(table.id));
  };

  return (
    <Grid item key={title} className={classes.categoryContainer}>
      <Typography variant="body2" className={classes.categoryTitle}>
        {title}
      </Typography>
      <hr />

      {layers.map(layer => {
        const { id: layerId, title: layerTitle, group: LayerGroup } = layer;
        if (LayerGroup && !LayerGroup.main) {
          return null;
        }

        const selected = selectedLayers.some(
          ({ id: testId }) => testId === layerId,
        );

        const validatedTitle = LayerGroup ? LayerGroup.name : layerTitle;

        return (
          <Box key={layerId} display="flex" mb={1}>
            <Switch
              size="small"
              color="default"
              checked={selected}
              onChange={toggleLayerValue(layer)}
              inputProps={{
                'aria-label': validatedTitle,
              }}
            />{' '}
            <Typography variant="body1">{validatedTitle}</Typography>
          </Box>
        );
      })}

      {tables.map(table => (
        <Button
          id={table.title}
          key={table.title}
          onClick={() => showTableClicked(table)}
        >
          <Typography variant="body1">{table.title}</Typography>
        </Button>
      ))}
    </Grid>
  );
}

const styles = () =>
  createStyles({
    categoryContainer: {
      marginBottom: 16,
      '&:last-child': {
        marginBottom: 0,
      },
    },

    categoryTitle: {
      fontWeight: 'bold',
      textAlign: 'left',
    },
  });

export interface MenuSwitchProps
  extends LayersCategoryType,
    WithStyles<typeof styles> {}

export default withStyles(styles)(MenuSwitch);
