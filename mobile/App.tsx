import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Dumbbell, Calendar, TrendingUp, Check, X, RefreshCw } from 'lucide-react-native';

const API_BASE = 'http://192.168.0.100:5000/api'; // Change to your local IP

interface Student {
  id: string;
  nome: string;
  email: string;
  plan: 'BASE' | 'PREMIUM';
  objetivo_principal: string;
}

interface Publication {
  id: string;
  version: number;
  validFrom: string;
  validTo?: string;
  data: any;
}

interface StudentData {
  student: Student;
  activePublication?: Publication;
  isPremium: boolean;
}

export default function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StudentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu token de acesso');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/student-area/by-token/${token}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Token inválido');
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message);
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setData(null);
    setToken('');
  };

  if (data) {
    return <WorkoutScreen data={data} onLogout={handleLogout} token={token} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Dumbbell size={64} color="#ff6b35" />
          <Text style={styles.title}>NovaFitness</Text>
          <Text style={styles.subtitle}>Área do Aluno</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Token de Acesso</Text>
          <TextInput
            style={styles.input}
            placeholder="Cole seu token aqui"
            placeholderTextColor="#666"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
}

function WorkoutScreen({ data, onLogout, token }: { data: StudentData; onLogout: () => void; token: string }) {
  const { student, activePublication, isPremium } = data;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>NovaFitness</Text>
        </View>
        <View style={styles.headerRight}>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Olá, {student.nome.split(' ')[0]}! 👋
          </Text>
          <Text style={styles.objectiveText}>
            Objetivo: {student.objetivo_principal}
          </Text>
        </View>

        {/* Today's Workout */}
        {activePublication ? (
          <View style={styles.workoutCard}>
            <View style={styles.cardHeader}>
              <Calendar size={20} color="#ff6b35" />
              <Text style={styles.cardTitle}>Treino de Hoje</Text>
              <Text style={styles.versionText}>v{activePublication.version}</Text>
            </View>

            {activePublication.data?.sessoes?.map((sessao: any, idx: number) => (
              <View key={idx} style={styles.sessionContainer}>
                <Text style={styles.sessionTitle}>
                  {sessao.dia} - {sessao.nome || 'Sessão'}
                </Text>
                {sessao.itens?.map((item: any, i: number) => (
                  <View key={i} style={styles.exerciseRow}>
                    <Text style={styles.exerciseName}>{item.nome_exercicio}</Text>
                    <Text style={styles.exerciseDetails}>
                      {item.series}x{item.reps}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Action Buttons */}
            {isPremium && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGreen]}>
                  <Check size={16} color="#22c55e" />
                  <Text style={styles.actionBtnTextGreen}>FEITO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRed]}>
                  <X size={16} color="#ef4444" />
                  <Text style={styles.actionBtnTextRed}>NÃO FIZ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnBlue]}>
                  <RefreshCw size={16} color="#3b82f6" />
                  <Text style={styles.actionBtnTextBlue}>SUBSTITUI</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Calendar size={48} color="#666" />
            <Text style={styles.emptyText}>Nenhum treino publicado ainda.</Text>
          </View>
        )}

        {/* Premium Notice */}
        {!isPremium && (
          <View style={styles.premiumNotice}>
            <Text style={styles.premiumNoticeText}>
              🌟 Assine o plano PREMIUM para registrar logs e acompanhar sua evolução!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a3a6e',
  },
  button: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#888',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  objectiveText: {
    color: '#aaa',
    marginTop: 4,
  },
  workoutCard: {
    backgroundColor: '#2a2a4e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a6e',
    gap: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  versionText: {
    color: '#888',
    fontSize: 14,
  },
  sessionContainer: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginTop: 1,
  },
  sessionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  exerciseName: {
    color: '#ccc',
  },
  exerciseDetails: {
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#3a3a6e',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  actionBtnRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionBtnBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  actionBtnTextGreen: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtnTextRed: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtnTextBlue: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#2a2a4e',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    marginTop: 16,
  },
  premiumNotice: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  premiumNoticeText: {
    color: '#f59e0b',
    textAlign: 'center',
  },
});
