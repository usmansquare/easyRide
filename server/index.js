import express from "express";

const app = express();
const port = 3000; //add your port here
const PUBLISHABLE_KEY = "pk_test_51LMWRHBlJML8pHCEHIcPtS5Sz8s5d8lisiaQYmb04IddIAgJbk4mi2Vr05TVXOsPzywpx3V8DOK3qc3GLaJgqJBV00Sunr8PtH";
const SECRET_KEY = "sk_test_51LMWRHBlJML8pHCEQcOgF9NBme75LvTvyqnt5oM0i5DUik4mwstKnRGiHeshsIbUGr0mTw4zBvFCx1ZucJiGNeYL00VMqL4M69";
import Stripe from "stripe";

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

app.listen(port, () => {
    console.log(`Example app listening at http://192.168.10.6:${port}`);
});

app.post("/create-payment-intent", async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1700000, //lowest denomination of particular currency
            currency: "pkr",
            payment_method_types: ["card"], //by default
            metadata:{ "email" : "usmanaslam1002@gmail.com" }
        })

        const clientSecret = paymentIntent.client_secret;

        res.json({
            clientSecret: clientSecret,
        });
    } catch (e) {
        console.log(e.message);
        res.json({
            error: e.message
        });
    }
});
