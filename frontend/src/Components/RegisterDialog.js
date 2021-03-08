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
import { ethers } from "ethers";

import { SUPERFLUID_USER_MANAGER_ADDRESS } from "../constants";
import { SUPER_FLUID_TEST_ABI } from "../Abi/SuperFluidTest";

const RegisterDialog = ({ refresh }) => {
  // Ethereum
  const { account, library } = useWeb3React();
  const signer = library.getSigner(account);
  const superFluidContract = new ethers.Contract(
    SUPERFLUID_USER_MANAGER_ADDRESS,
    SUPER_FLUID_TEST_ABI,
    signer
  );

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [transactionProcessing, setTransactionProcessing] = useState(false);

  const geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const getLocation = async (onSuccess) => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            navigator.geolocation.getCurrentPosition(onSuccess);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              onSuccess,
              (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
              },
              geoLocationOptions
            );
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="large" variant="outlined">
        <Typography variant="h2">Register</Typography>
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Apply for Insurance</DialogTitle>
        <DialogContent>
          {transactionProcessing && <CircularProgress />}
          {isRegistered === null && !transactionProcessing && (
            <>
              <CircularProgress />
              Querying Registraion Status
            </>
          )}
          {isRegistered === false && <h5>You need to get registered</h5>}
        </DialogContent>
        <DialogActions>
          {latitude === null || longitude === null ? (
            <Button
              onClick={async () => {
                console.log("Fetching user location...");
                await getLocation((pos) => {
                  const { latitude, longitude } = pos.coords;
                  setLatitude(latitude);
                  setLongitude(longitude);
                  console.log(
                    `Fetched latitude ${latitude} and longitude ${longitude}`
                  );
                });
              }}
            >
              Give Location Access
            </Button>
          ) : (
            <Button
              onClick={async () => {
                const decimals = await superFluidContract.locationDecimals();
                console.log(`Decimals for location: ${decimals}`);
                const scaledLatitude = Math.floor(
                  latitude * Math.pow(10, decimals)
                );
                const scaledLongitude = Math.floor(
                  longitude * Math.pow(10, decimals)
                );
                console.log(
                  `Scaled Latitude: ${scaledLatitude}, Scaled Longitude: ${scaledLongitude}`
                );
                console.log("Sending transaction to register user...");
                setTransactionProcessing(true);
                const tx = await superFluidContract.registerUser(
                  scaledLatitude,
                  scaledLongitude
                );
                console.log(`Transaction: `, tx);
                setTransactionProcessing(false);
                setIsOpen(false);
                refresh();
              }}
            >
              Register
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterDialog;
