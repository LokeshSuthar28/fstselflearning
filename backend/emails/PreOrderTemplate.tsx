import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

export interface PreOrderEmailProps {
  customerName: string;
  orderNumber: string;
  modelName: string;
  edition: string;
  size: string | number;
  quantity: number;
  unitPrice: string | number;
  totalAmount: string | number;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  dropDate?: string;
}

export const PreOrderTemplate = ({
  customerName = "Cyber Operative",
  orderNumber = "SH-2026-X892",
  modelName = "QUANTUM CYBER-PULSE 9000",
  edition = "Obsidian Stealth Matrix",
  size = "10.5",
  quantity = 1,
  unitPrice = "320.00",
  totalAmount = "320.00",
  shippingAddress = {
    street: "777 Neon Boulevard, Sector 9",
    city: "Neo Kyoto",
    state: "NK",
    postalCode: "94016",
    country: "US",
  },
  dropDate = "Q4 2026 / BATCH 01",
}: PreOrderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Step High Pre-Order Confirmed: {modelName} [{orderNumber}]</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Brand Badge */}
          <Section style={headerSection}>
            <Text style={brandLabel}>STEP HIGH // FOOTWEAR LABS</Text>
            <Heading style={heading}>PRE-ORDER CONFIRMED</Heading>
            <Text style={subheading}>
              SYSTEM AUTHENTICATION: <span style={cyanText}>ALLOCATION SECURED</span>
            </Text>
          </Section>

          {/* Status Capsule */}
          <Section style={statusCapsule}>
            <Row>
              <Column>
                <Text style={statusText}>
                  ORDER REF: <span style={highlight}>{orderNumber}</span>
                </Text>
              </Column>
              <Column align="right">
                <Text style={badge}>CONFIRMED // IN QUEUE</Text>
              </Column>
            </Row>
          </Section>

          {/* Customer Greeting */}
          <Section style={contentSection}>
            <Text style={paragraph}>
              Greetings, <strong style={whiteText}>{customerName}</strong>.
            </Text>
            <Text style={paragraph}>
              Your reservation for the limited-run release has been committed to the
              high-throughput ledger. Production slot validation is locked.
            </Text>
          </Section>

          {/* Product Specification Matrix */}
          <Section style={card}>
            <Text style={cardCategory}>ALLOCATED ASSET SPECIFICATION</Text>
            <Heading as="h3" style={modelTitle}>
              {modelName}
            </Heading>
            <Text style={editionText}>{edition}</Text>

            <Hr style={divider} />

            <Row style={specRow}>
              <Column>
                <Text style={specLabel}>SHOE SIZE (US):</Text>
                <Text style={specValue}>{size}</Text>
              </Column>
              <Column>
                <Text style={specLabel}>QUANTITY:</Text>
                <Text style={specValue}>{quantity}</Text>
              </Column>
              <Column align="right">
                <Text style={specLabel}>UNIT PRICE:</Text>
                <Text style={specValue}>${unitPrice}</Text>
              </Column>
            </Row>

            <Hr style={divider} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>TOTAL AMOUNT BILLED:</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${totalAmount} USD</Text>
              </Column>
            </Row>
          </Section>

          {/* Logistics Coordinates */}
          <Section style={shippingSection}>
            <Text style={cardCategory}>DISPATCH COORDINATES</Text>
            <Text style={addressText}>
              {shippingAddress.street}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              <br />
              {shippingAddress.country}
            </Text>
            <Text style={dropDateText}>
              ESTIMATED VAULT DISPATCH: <strong style={cyanText}>{dropDate}</strong>
            </Text>
          </Section>

          {/* CTA Link */}
          <Section style={ctaSection}>
            <Link
              href={`https://stephigh.internal/orders/${orderNumber}`}
              style={button}
            >
              ACCESS VAULT ORDER TRACKER →
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer Security Notice */}
          <Section style={footerSection}>
            <Text style={footerText}>
              SECURE TRANSACTION ID // CRYPTOGRAPHICALLY SIGNED VIA BETTER-AUTH & RESEND
            </Text>
            <Text style={footerSubtext}>
              Step High Sneakers Inc. | Orbital Terminal 4, Cyber Highway | All Rights Reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PreOrderTemplate;

// =========================================================================
// Dark, Sci-Fi Cyberpunk Inline Styling (Matches Step High Aesthetic)
// =========================================================================

const main: React.CSSProperties = {
  backgroundColor: "#050608",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, monospace',
  padding: "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#0d0f17",
  border: "1px solid #1e2235",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "580px",
  padding: "36px 32px",
  boxShadow: "0 0 35px rgba(0, 240, 255, 0.08)",
};

const headerSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "24px",
};

const brandLabel: React.CSSProperties = {
  color: "#00f0ff",
  fontSize: "11px",
  letterSpacing: "4px",
  fontWeight: 700,
  margin: "0 0 8px 0",
  textTransform: "uppercase",
};

const heading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "26px",
  fontWeight: 800,
  letterSpacing: "1.5px",
  margin: "0 0 6px 0",
  textTransform: "uppercase",
};

const subheading: React.CSSProperties = {
  color: "#7e88a6",
  fontSize: "12px",
  letterSpacing: "1px",
  margin: 0,
};

const statusCapsule: React.CSSProperties = {
  backgroundColor: "#131726",
  border: "1px solid #28304f",
  borderRadius: "8px",
  padding: "12px 16px",
  marginBottom: "24px",
};

const statusText: React.CSSProperties = {
  color: "#8c96b5",
  fontSize: "12px",
  margin: 0,
};

const highlight: React.CSSProperties = {
  color: "#00f0ff",
  fontWeight: "bold",
  fontFamily: "monospace",
};

const badge: React.CSSProperties = {
  backgroundColor: "rgba(0, 255, 102, 0.12)",
  border: "1px solid #00ff66",
  borderRadius: "4px",
  color: "#00ff66",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "1px",
  padding: "4px 8px",
  display: "inline-block",
  margin: 0,
};

const contentSection: React.CSSProperties = {
  marginBottom: "24px",
};

const paragraph: React.CSSProperties = {
  color: "#a6b1d1",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 12px 0",
};

const whiteText: React.CSSProperties = {
  color: "#ffffff",
};

const cyanText: React.CSSProperties = {
  color: "#00f0ff",
  fontWeight: 600,
};

const card: React.CSSProperties = {
  backgroundColor: "#111422",
  border: "1px solid #202742",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "24px",
};

const cardCategory: React.CSSProperties = {
  color: "#00f0ff",
  fontSize: "10px",
  letterSpacing: "2px",
  fontWeight: 700,
  margin: "0 0 10px 0",
};

const modelTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  margin: "0 0 4px 0",
  letterSpacing: "0.5px",
};

const editionText: React.CSSProperties = {
  color: "#7e88a6",
  fontSize: "13px",
  margin: "0 0 16px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#202742",
  margin: "16px 0",
};

const specRow: React.CSSProperties = {
  margin: "8px 0",
};

const specLabel: React.CSSProperties = {
  color: "#6b7799",
  fontSize: "10px",
  letterSpacing: "1px",
  margin: "0 0 4px 0",
};

const specValue: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  margin: 0,
  fontFamily: "monospace",
};

const totalRow: React.CSSProperties = {
  marginTop: "12px",
};

const totalLabel: React.CSSProperties = {
  color: "#8c96b5",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "1px",
  margin: 0,
};

const totalValue: React.CSSProperties = {
  color: "#00ff66",
  fontSize: "18px",
  fontWeight: 800,
  fontFamily: "monospace",
  margin: 0,
};

const shippingSection: React.CSSProperties = {
  backgroundColor: "#111422",
  border: "1px solid #202742",
  borderRadius: "8px",
  padding: "18px 20px",
  marginBottom: "24px",
};

const addressText: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 10px 0",
};

const dropDateText: React.CSSProperties = {
  color: "#8c96b5",
  fontSize: "11px",
  margin: 0,
  letterSpacing: "1px",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#00f0ff",
  color: "#050608",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "1px",
  padding: "14px 28px",
  textDecoration: "none",
  display: "inline-block",
  boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)",
};

const footerSection: React.CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
};

const footerText: React.CSSProperties = {
  color: "#4e5774",
  fontSize: "10px",
  letterSpacing: "1.5px",
  margin: "0 0 6px 0",
};

const footerSubtext: React.CSSProperties = {
  color: "#383f54",
  fontSize: "10px",
  margin: 0,
};
