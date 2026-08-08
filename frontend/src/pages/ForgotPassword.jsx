import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { Mail, Loader2, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez saisir votre email.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.success) {
        setSent(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la demande.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blanc pt-24 px-4">
      <Card className="w-full max-w-sm shadow-xl p-4 transition-all duration-300 border-t-4 border-t-mauve-fonce">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-mauve-fonce">
            Mot de passe oublié
          </CardTitle>
          <p className="text-sm text-mauve-fonce/70">
            Saisissez votre email pour recevoir un lien de réinitialisation.
          </p>
        </CardHeader>

        <CardContent>
          {sent ? (
            <p className="text-mauve-fonce text-center py-4">
              Si un compte existe pour cet email, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-mauve-fonce/70" /> Email
                </Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-base mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Envoyer le lien
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4">
          <Link to="/login" className="w-full text-center">
            <Button variant="link" className="text-sm w-full text-mauve-fonce hover:text-mauve-fonce/80">
              Retour à la connexion
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;