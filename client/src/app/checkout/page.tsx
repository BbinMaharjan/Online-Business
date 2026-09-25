"use client";

import { useState, useEffect } from "react";
import { Container, Box, Typography, Stepper, Step, StepLabel, Button, Grid, Paper, Divider, Alert, TextField, Radio, RadioGroup, FormControlLabel, List, ListItem, ListItemText, ListItemSecondaryAction, Accordion, AccordionSummary, AccordionDetails, LinearProgress } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Icons } from "@/lib/icons";

const { CheckCircle, LocalShipping, CreditCard, Check, ShoppingCart, Person, LocationOn } = Icons;
import { useCart, useInvalidateCart } from "@/services/api/cart";
import { useAddresses } from "@/services/api/addresses";
import { useCreateOrder } from "@/services/api/orders";
import { useShippingMethods } from "@/services/api/orders";
import { useUser } from "@/services/api/auth";
import { apiClient } from "@/lib/api-client";
import { Address } from "@/types";
import { formatPrice } from "@/lib/utils";

const steps = [
  { label: "Cart", icon: <ShoppingCart /> },
  { label: "Address", icon: <LocationOn /> },
  { label: "Shipping", icon: <LocalShipping /> },
  { label: "Payment", icon: <CreditCard /> },
  { label: "Review", icon: <CheckCircle /> },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const { data: userData } = useUser();
  const { data: shippingMethodsData, isLoading: shippingLoading } = useShippingMethods();
  const createOrder = useCreateOrder();
  const invalidateCart = useInvalidateCart();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cod" | "card">("cod");
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    type: "SHIPPING",
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = cartData?.data?.items || [];
  const cart = cartData?.data;
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const tax = cart?.tax || 0;
  const shippingFee = selectedShippingMethodId
    ? shippingMethodsData?.data?.find((m: any) => m._id === selectedShippingMethodId)?.price || 0
    : 0;
  const total = subtotal - discount + tax + shippingFee;

  const addresses = addressesData?.data || [];

  useEffect(() => {
    if (!cartData?.data || items.length === 0) {
      router.push("/cart");
    }
    if (!userData?.data) {
      router.push(`/login?redirect=/checkout`);
    }
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: Address) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [cartData, userData, addresses, router, items.length, selectedAddressId]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedAddressId && !showAddressForm) setActiveStep(activeStep + 1);
    } else if (activeStep === 1) {
      if (!selectedAddressId) return;
      setActiveStep(activeStep + 1);
    } else if (activeStep === 2) {
      if (!selectedShippingMethodId) return;
      setActiveStep(activeStep + 1);
    } else if (activeStep === 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedShippingMethodId) return;

    setIsSubmitting(true);
    try {
      const order = await createOrder.mutateAsync({
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        shippingMethodId: selectedShippingMethodId,
        paymentMethod: selectedPaymentMethod,
        notes: "",
      });

      if (selectedPaymentMethod === "card") {
        const payment = await apiClient.payments.create(
          order.data._id,
          "stripe",
          "CARD"
        );
        if (payment.data?.redirectUrl) {
          window.location.href = payment.data.redirectUrl;
          return;
        }
      }

      invalidateCart();
      router.push(`/checkout/success?orderId=${order.data._id}`);
    } catch (error: any) {
      alert(error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading || addressesLoading || shippingLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: "center" }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={(props: { active: boolean }) => (
                  props.active ? <CheckCircle /> : step.icon
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          {activeStep === 0 && <CartStep items={items} cart={cart} onNext={handleNext} />}
          {activeStep === 1 && <AddressStep addresses={addresses} selectedAddressId={selectedAddressId} onSelectAddress={setSelectedAddressId} newAddress={newAddress} setNewAddress={setNewAddress} showAddressForm={showAddressForm} setShowAddressForm={setShowAddressForm} onNext={handleNext} onBack={handleBack} />}
          {activeStep === 2 && <ShippingStep shippingMethods={shippingMethodsData?.data || []} selectedShippingMethodId={selectedShippingMethodId} onSelectShipping={setSelectedShippingMethodId} onNext={handleNext} onBack={handleBack} />}
          {activeStep === 3 && <PaymentStep selectedPaymentMethod={selectedPaymentMethod} onSelectPayment={setSelectedPaymentMethod} onNext={handleNext} onBack={handleBack} />}
          {activeStep === 4 && <ReviewStep items={items} cart={cart} selectedAddress={addresses.find((a: Address) => a._id === selectedAddressId)} selectedShippingMethod={shippingMethodsData?.data?.find((m: any) => m._id === selectedShippingMethodId)} selectedPaymentMethod={selectedPaymentMethod} subtotal={subtotal} discount={discount} tax={tax} shippingFee={shippingFee} total={total} onPlaceOrder={handlePlaceOrder} onBack={handleBack} isSubmitting={isSubmitting} />}
        </Paper>

        <OrderSummary cart={cart} items={items} selectedShippingMethodId={selectedShippingMethodId} shippingMethods={shippingMethodsData?.data || []} subtotal={subtotal} discount={discount} tax={tax} shippingFee={shippingFee} total={total} />
      </Box>
    </Container>
  );
}

function CartStep({ items, cart, onNext }: any) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Review Your Cart</Typography>
      {items.map((item: any) => (
        <Box key={item._id} sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, borderBottom: 1, borderColor: "divider" }}>
          <img src={item.image || "/placeholder-product.jpg"} alt={item.productName} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1">{item.productName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Qty: {item.quantity} × {formatPrice(item.price)}
            </Typography>
          </Box>
          <Typography variant="h6">{formatPrice(item.subtotal)}</Typography>
        </Box>
      ))}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" size="large" onClick={onNext}>
          Continue to Address
        </Button>
      </Box>
    </Box>
  );
}

function AddressStep({ addresses, selectedAddressId, onSelectAddress, newAddress, setNewAddress, showAddressForm, setShowAddressForm, onNext, onBack }: any) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Shipping Address</Typography>

      {showAddressForm ? (
        <AddressForm
          address={newAddress}
          onChange={setNewAddress}
          onSave={() => {
            setShowAddressForm(false);
          }}
          onCancel={() => setShowAddressForm(false)}
        />
      ) : (
        <>
          {addresses.length === 0 ? (
            <Alert severity="info">
              No saved addresses. Please add a new address.
            </Alert>
          ) : (
            <List>
              {addresses.map((address: any) => (
                <ListItem
                  key={address._id}
                  onClick={() => onSelectAddress(address._id)}
                  sx={{ mb: 1, border: 1, borderColor: selectedAddressId === address._id ? "primary.main" : "divider", borderRadius: 1 }}
                >
                  <ListItemText
                    primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{address.fullName}</Typography>}
                    secondary={
                      <>
                        {address.addressLine1} {address.addressLine2 && ", " + address.addressLine2}<br />
                        {address.city}, {address.state} {address.postalCode}, {address.country}<br />
                        Phone: {address.phone}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {selectedAddressId === address._id && <CheckCircle color="primary" />}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => setShowAddressForm(true)} startIcon={<Person />}>
              Add New Address
            </Button>
            {addresses.length > 0 && (
              <Button variant="contained" onClick={onNext} disabled={!selectedAddressId}>
                Continue to Shipping
              </Button>
            )}
          </Box>
        </>
      )}
      <Button variant="text" onClick={onBack} sx={{ mt: 2 }}>Back</Button>
    </Box>
  );
}

function AddressForm({ address, onChange, onSave, onCancel }: any) {
  return (
    <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>Add New Address</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Full Name" value={address.fullName} onChange={(e) => onChange({ ...address, fullName: e.target.value })} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Phone" value={address.phone} onChange={(e) => onChange({ ...address, phone: e.target.value })} required />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Address Line 1" value={address.addressLine1} onChange={(e) => onChange({ ...address, addressLine1: e.target.value })} required />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Address Line 2 (Optional)" value={address.addressLine2} onChange={(e) => onChange({ ...address, addressLine2: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="City" value={address.city} onChange={(e) => onChange({ ...address, city: e.target.value })} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="State/Province" value={address.state} onChange={(e) => onChange({ ...address, state: e.target.value })} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Postal Code" value={address.postalCode} onChange={(e) => onChange({ ...address, postalCode: e.target.value })} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Country" value={address.country} onChange={(e) => onChange({ ...address, country: e.target.value })} required />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={onSave}>Save Address</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}

function ShippingStep({ shippingMethods, selectedShippingMethodId, onSelectShipping, onNext, onBack }: any) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Shipping Method</Typography>
      {shippingMethods.length === 0 ? (
        <Alert severity="info">No shipping methods available</Alert>
      ) : (
        <RadioGroup value={selectedShippingMethodId} onChange={(e) => onSelectShipping(e.target.value)} row>
          {shippingMethods.map((method: any) => (
            <FormControlLabel
              key={method._id}
              value={method._id}
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{method.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method.description} • {method.estimatedDays} business days • {formatPrice(method.price)}
                  </Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>
      )}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={onNext} disabled={!selectedShippingMethodId}>
          Continue to Payment
        </Button>
        <Button variant="outlined" onClick={onBack}>Back</Button>
      </Box>
    </Box>
  );
}

function PaymentStep({ selectedPaymentMethod, onSelectPayment, onNext, onBack }: any) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Payment Method</Typography>
      <RadioGroup value={selectedPaymentMethod} onChange={(e) => onSelectPayment(e.target.value as "cod" | "card")} row>
        <FormControlLabel
          value="cod"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Cash on Delivery</Typography>
              <Typography variant="body2" color="text.secondary">Pay when you receive your order</Typography>
            </Box>
          }
        />
        <FormControlLabel
          value="card"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Credit/Debit Card</Typography>
              <Typography variant="body2" color="text.secondary">Secure payment via Stripe</Typography>
            </Box>
          }
        />
      </RadioGroup>
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={onNext}>Continue to Review</Button>
        <Button variant="outlined" onClick={onBack}>Back</Button>
      </Box>
    </Box>
  );
}

function ReviewStep({ items, cart, selectedAddress, selectedShippingMethod, selectedPaymentMethod, subtotal, discount, tax, shippingFee, total, onPlaceOrder, onBack, isSubmitting }: any) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Review Order</Typography>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Shipping Address</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {selectedAddress ? (
            <>
              <Typography>{selectedAddress.fullName}</Typography>
              <Typography>{selectedAddress.addressLine1} {selectedAddress.addressLine2 && ", " + selectedAddress.addressLine2}</Typography>
              <Typography>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}, {selectedAddress.country}</Typography>
              <Typography>Phone: {selectedAddress.phone}</Typography>
            </>
          ) : (
            <Typography color="text.secondary">No address selected</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Shipping Method</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {selectedShippingMethod ? (
            <>
              <Typography>{selectedShippingMethod.name}</Typography>
              <Typography variant="body2" color="text.secondary">{selectedShippingMethod.estimatedDays} business days</Typography>
            </>
          ) : (
            <Typography color="text.secondary">No shipping method selected</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Payment Method</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{selectedPaymentMethod === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Order Items</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {items.map((item: any) => (
            <Box key={item._id} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography>{item.productName} × {item.quantity}</Typography>
              <Typography>{formatPrice(item.subtotal)}</Typography>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" size="large" onClick={onPlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
        <Button variant="outlined" onClick={onBack}>Back</Button>
      </Box>
    </Box>
  );
}

function OrderSummary({ cart, items, selectedShippingMethodId, shippingMethods, subtotal, discount, tax, shippingFee, total }: any) {
  return (
    <Paper elevation={1} sx={{ p: 3, height: "fit-content", position: "sticky", top: 100 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Order Summary</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">{items.length} items</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Subtotal</Typography>
        <Typography>{formatPrice(subtotal)}</Typography>
      </Box>
      {discount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: "success.main" }}>
          <Typography>Discount</Typography>
          <Typography>-{formatPrice(discount)}</Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Shipping</Typography>
        <Typography>{shippingFee > 0 ? formatPrice(shippingFee) : "Calculating..."}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Tax</Typography>
        <Typography>{formatPrice(tax)}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.25rem" }}>
        <Typography>Total</Typography>
        <Typography>{formatPrice(total)}</Typography>
      </Box>
    </Paper>
  );
}