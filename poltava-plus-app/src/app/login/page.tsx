import LoginForm from "@/components/LoginForm/LoginForm";

export default function LoginPage() {
  return (
    <main style={{ 
      backgroundColor: '#000000', 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <LoginForm />
    </main>
  );
}