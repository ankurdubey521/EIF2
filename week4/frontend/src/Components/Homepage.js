import React, { useState, useEffect } from "react";
import Titlebar from "./Titlebar";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { SUPERFLUID_USER_MANAGER_ADDRESS } from "../constants";
import { SUPER_FLUID_TEST_ABI } from "../Abi/SuperFluidTest";
import RegisterDialog from "./RegisterDialog";
import ApplyDialog from "./ApplyDialog";
import { Typography } from "@material-ui/core";

const Homepage = () => {
  const { account, library } = useWeb3React();
  const [isRegistered, setIsRegistered] = useState(null);
  const [isPayingPremiun, setIsPayingPremiun] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const reRenderHomePage = () => setNeedsRefresh(!needsRefresh);

  useEffect(() => {
    const operation = async () => {
      const signer = library.getSigner(account);
      const superFluidContract = new ethers.Contract(
        SUPERFLUID_USER_MANAGER_ADDRESS,
        SUPER_FLUID_TEST_ABI,
        signer
      );

      // Check if address is registered
      const registrationStatus = await superFluidContract.isAddressRegistered(
        account
      );
      if (registrationStatus) {
        console.log(`${account} is registered`);
      } else {
        console.log(`${account} is not registred`);
      }
      setIsRegistered(registrationStatus);

      // Check fi user is paying premiums
      const premiumPaymentStatus = await superFluidContract.isAddressSendingPremiums(
        account
      );
      if (premiumPaymentStatus) {
        console.log(`${account} is paying premiums`);
      } else {
        console.log(`${account} is not paying premiums`);
      }
      setIsPayingPremiun(premiumPaymentStatus);
    };
    operation()
      .then(() => {})
      .catch(console.log);
  }, [account, isRegistered, library, needsRefresh]);

  return (
    <>
      <Titlebar />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {!isRegistered && (
          <Typography variant="h2">
            A Hurricane can strike at any moment. Register today to get insured
            against damages that may uproot your life.
          </Typography>
        )}
        {isRegistered && !isPayingPremiun && (
          <Typography variant="h2">
            Once you start paying the premiums you'll automatically recieve a
            payout if you're hit by a hurricane.
          </Typography>
        )}
        {isPayingPremiun && (
          <Typography variant="h2">You are now insured!</Typography>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {account &&
          (isRegistered ? (
            !isPayingPremiun && <ApplyDialog refresh={reRenderHomePage} />
          ) : (
            <RegisterDialog refresh={reRenderHomePage} />
          ))}{" "}
      </div>
    </>
  );
};

export default Homepage;
