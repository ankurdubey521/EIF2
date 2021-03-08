import React from "react";
import { Portis, Injected } from "../utils/web3-connectors";
import { useWeb3React } from "@web3-react/core";
import { AppBar, Grid, Typography } from "@material-ui/core";
import { MetaMaskButton, Button, EthAddress } from "rimble-ui";

const styles = {
  appbar: {
    background: "transparent",
    boxShadow: "none",
    backdropFilter: "blur(15px)",
    marginTop: 10,
  },
};

const Titlebar = () => {
  const { account, activate } = useWeb3React();
  return (
    <AppBar position="static" style={styles.appbar}>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" color="textPrimary">
            HURRICANE INSURANCE
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={6}
          spacing={2}
          alignItems="center"
          justify="flex-end"
        >
          {account && (
            <Grid item>
              <EthAddress address={account} />
            </Grid>
          )}
          <Grid item>
            <MetaMaskButton onClick={() => activate(Injected)}>
              Metamask
            </MetaMaskButton>
          </Grid>
          <Grid item>
            <Button
              mainColor="#805ad5"
              onClick={() => activate(Portis)}
              fullWidth
            >
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <img
                    src="https://www.portis.io/static/logo-small.svg"
                    alt="portis-logo"
                    width={15}
                  />
                </Grid>
                <Grid item>Portis</Grid>
              </Grid>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Titlebar;
