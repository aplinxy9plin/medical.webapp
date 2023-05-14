import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Variant } from '@mui/material/styles/createTypography';

interface Film {
  title: string;
  year: number;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// type AutoCompleteType = {
//   props: 
// }

export default function AutoCompleteCustom(props: {
  predict?: string[] | undefined;
  variant?: "outlined" | undefined;
} & Omit<TextFieldProps, 'variant'>) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly string[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!props.predict) {
      return undefined;
    }

    (async () => {
      // await sleep(5000); // For demo purposes.

      if (active) {
        if(props.name && props.predict){
          setOptions([...props.predict]);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, props.predict]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      freeSolo
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => {
        return option
      }}
      onChange={(e, opt) => {
        if(props.onChange && opt && props.name){
          props.onChange({
            currentTarget: {
              value: opt,
              name: props.name
            }
          })
        }
      }}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          {...props}
        />
      )}
    />
  );
}