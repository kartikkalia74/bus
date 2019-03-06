
const stripe = require("stripe")("sk_test_OJrMVhZiIroiQ2CZOzrrfZTO");
const payment = {};

// create customer
payment.create = (email ,cb)=>{
    stripe.customers.create({
        email
    },
    function(err,customer){
        if(err) throw err;
        console.log(customer)
        cb(customer)
    })
}

payment.generateSource = (cusomerId,token)=>{

    stripe.customers.createSource(cusomerId,{
        source:token
    },function(err,source){
        if(err) throw err;
        console.log(source)
    })

}

payment.cardToken = () =>{
    stripe.tokens.create({
        card:{
            number:4242424242424242,
            exp_month:2,
            exp_year:2023,
            cvc:'342'

        }
    },
    function(err,token){
        if(err) throw err;
        console.log(token)
    })
}

payment.deleteCustomers = (customerId) =>{
    stripe.customers.del(customerId,function(err,customerStatus){
        if(err) throw err;
        console.log(customerStatus)
    })
}

payment.retrieveCustomers = () =>{
    stripe.customers.retrieve("cus_EbxFVjPhYdvKEL",function(err,customerDetail){
        if(err) throw err;
        console.log(customerDetail)
    })
}


payment.bankAccount = ()=>{
    stripe.tokens.create({
        bank_account:{
            country:"US",
            currency: "usd",
            account_holder_name:"ckeck1",
            account_holder_type:"individual",
            routing_number:'110000000',
            account_number:'000123456789'
        }
    },function(err,token){
        if(err) throw err;
        console.log(token)
    })
}

payment.verify = (customerId,sourceId)=>{
    stripe.customers.verifySource(
        customerId,
        sourceId,
        {amounts:[32,45]},
        function(err,bankaccount){
            if(err) throw err;
            console.log(bankaccount)
    })
}

payment.listSources = (cusomerId) =>{
    stripe.customers.listSources(cusomerId,function(err,accountDetails){
        if(err) throw err;
        console.log(accountDetails)
    })
}

payment.charge = (source,amount,currency,customer,cb) => {
    stripe.charges.create({
        customer,
        amount,
        currency,
        source
    },function(err,charge){
        if(err) throw err;
        console.log(charge,'ff')
       cb(charge)
    })
}

payment.customersList = () =>{
    stripe.customers.list({limit:5},function(err,data){
        if(err) throw err;
        console.log(data.data[0].sources)
        
    })
}
payment.customerupdate = () =>{
    stripe.customers.update(
        'cus_EbxFVjPhYdvKEL',
         {email : "check123@gmail.com"},
          function(err, customer) {
          // asynchronously called
          console.log(customer)
        }
      );
}

payment.createStripeAccount = ()=> {
    stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: 'check123@gmail.com',
         requested_capabilities: ['card_payments']
      }, function(err, account) {
        // asynchronously called
        if(err) throw err
        console.log(account)
      })
}
payment.updateStripeAccount = () =>{
    stripe.accounts.update(
        'acct_1EAaZ9Fnq9KCqcCY',
         {email: 'check@double.com'},
          function(err, account) {
          // asynchronously called
          if(err) throw err;
          console.log(account)
        }
    )
}

// billing 

var Billing = {}


Billing.createProduct = ()=>{
    stripe.products.create({
        name:"salary",
        type:"service"
    },function(err,product){
        if(err) throw err;
        console.log(product,'hh')
    })
}

Billing.createPlan = () =>{
    stripe.plans.create({
        product: 'prod_Edt3hVbQdB6aYF',
        nickname: 'salary per day USD',
        currency: 'usd',
        interval: 'day',
        amount: 100,
      },function(err,plan){
          if(err) throw err;
          console.log(plan,'jkjk')
      });
}

    Billing.createSubscription = () =>{
        stripe.subscriptions.create({
            customer:"cus_EbxFVjPhYdvKEL",
            items:[{plan:"plan_EdtFpBhpeYtOU2"}]
        },function(err,subscriptinData){
            if(err) throw err;
            console.log(subscriptinData)
        })
    }













/* payment.create("check@gmail.com",function(customer){
    console.log(customer)
}) */
 /* payment.bankAccount()*/
/* payment.generateSource("cus_EbxFVjPhYdvKEL","tok_1E8l9xGzil7oHtkfhJDXLLO4") */
/* payment.verify("cus_EbxFVjPhYdvKEL","ba_1E8jaTGzil7oHtkf9XsUzI3F") */

/* payment.charge("card_1E8l9xGzil7oHtkfDestBXgC",1000,'USD','cus_EbeBcUt04SgEgL'); */
/* payment.deleteCustomers("cus_EbxBoxzvIqW88Y") */
/* payment.retrieveCustomers() */
/* payment.listSources("cus_EbxFVjPhYdvKEL") */
// payment.customersList()
/* payment.cardToken() */
/* payment.customerupdate() */
/* payment.createStripeAccount() */
/* payment.updateStripeAccount() */





/* Billing.createProduct() */
/* Billing.createPlan(); */
/* Billing.createSubscription() */

module.exports = payment;