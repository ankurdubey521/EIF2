import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";

import { SUPERFLUID_USER_MANAGER_ADDRESS } from "../constants";
import { getPremiumRatePerSecond } from "../utils/chainlink-api-contract";
import { getSuperfluidSdk, startFlowFDaiX } from "../utils/superfluid";

const ApplyDialog = ({ refresh }) => {
  // Ethereum
  const { account } = useWeb3React();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [premiumRate, setPremiumRate] = useState(null);
  const [superFluidFramework, setSuperFluidFramework] = useState(null);

  useEffect(() => {
    const operation = async () => {
      // Get premium rate for user
      const premiumRate = await getPremiumRatePerSecond(account);
      console.log(`Premium Rate for user: ${premiumRate} fDAI/s`);
      setPremiumRate(premiumRate);

      console.log("Setting up superfluid framework...");
      setSuperFluidFramework(await getSuperfluidSdk());
    };
    operation()
      .then(() => {})
      .catch(console.log);
  }, [account]);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="large" variant="outlined">
        <Typography variant="h3">Apply for an Insurance</Typography>
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Apply for Insurance</DialogTitle>
        <DialogContent>
          {transactionProcessing && <CircularProgress />}
          {premiumRate && !transactionProcessing && (
            <h4>
              Your premium rate is {premiumRate} x 10<sup>-18</sup> fDAI/s
            </h4>
          )} 
        </DialogContent>
        <DialogActions>
          {premiumRate && (
            <Button
              onClick={async () => {
                setTransactionProcessing(true);
                await startFlowFDaiX(
                  premiumRate,
                  account,
                  SUPERFLUID_USER_MANAGER_ADDRESS,
                  superFluidFramework
                );
                setTransactionProcessing(false);
                setIsOpen(false);
                refresh();
              }}
            >
              Start Payments
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplyDialog;
