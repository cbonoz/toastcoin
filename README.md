![ToastCoin](static/toast-yellow.png)
<br/>
# ToastCoin <!-- Restaurant Reward Currency. -->
---
## Concept:
Create a universal rewards program for restaurants tracked by a restaurant-focused cryptocurrency (ToastCoin).

## Details:
* Users can sign up for a toast coin account and initially receive 100 toast coin.
* Coins are earned through purchases at Toast restaurants.
* Coins can be redeemed for discounts and promos across *any* of the restaurants in the Toast network.

## Implementation:
* Single page React App. Shows live feed or users and balances on the home page.
* User interaction with the currency is primarily phone sms driven (for now).
* When users text the ToastCoin phone number with their name for the first time, this will create an account for that name/numbers and initialize the toastcoin balance for that user to 100.
* Users can generate (mine) additional coins by sending text messages containing a continuous string of '1's. The number of 1's will be translated into an earned number of coins which will be displayed on the webpage and credited to the user's account balance.
* Users can send coins to other users by name.
* Users can redeem points for restaurant swag and promotions (ex: redeem 1000 toastcoin for a KFC coupon).

### Dev Notes:

See subpackages (client and server) for information for how to run.

