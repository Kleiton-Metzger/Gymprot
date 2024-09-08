import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const PoliticaPrivacidadeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Política de Privacidade</Text>
          <Text style={styles.headerSubtitle}>Última atualização: 01/08/2024</Text>
        </View>
      </View>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
        Exemplo de Política de Privacidade
      </Text>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentText}>
          Na aplicação Exercise and Work Integrator, privacidade e segurança são prioridades e nos comprometemos com a
          transparência do tratamento de dados pessoais dos nossos usuários/clientes. Por isso, esta presente Política
          de Privacidade estabelece como é feita a coleta, uso e transferência de informações de clientes ou outras
          pessoas que acessam ou usam nosso site.
        </Text>
        <Text style={styles.contentText}>
          Ao utilizar nossos serviços, você entende que coletaremos e usaremos suas informações pessoais nas formas
          descritas nesta Política, sob as normas da Constituição Federal de 1988 (art. 5º, LXXIX; e o art. 22º, XXX –
          incluídos pela EC 115/2022), das normas de Proteção de Dados (LGPD, Lei Federal 13.709/2018), das disposições
          consumeristas da Lei Federal 8078/1990 e as demais normas do ordenamento jurídico brasileiro aplicáveis.
        </Text>
        <Text style={styles.contentText}>
          Dessa forma, a aplicação Exercise and Work Integrator, doravante denominada simplesmente como “Exercise and
          Work Integrator”, inscrita no CNPJ/MF sob o nº (nº do CNPJ), no papel de Controladora de Dados, obriga-se ao
          disposto na presente Política de Privacidade.
        </Text>
        <Text style={styles.sectionTitle}>1. Quais dados coletamos sobre você e para qual finalidade?</Text>
        <Text style={styles.contentText}>
          Nosso site coleta e utiliza alguns dados pessoais seus, de forma a viabilizar a prestação de serviços e
          aprimorar a experiência de uso.
        </Text>
        <Text style={styles.subSectionTitle}>1.1. Dados pessoais fornecidos pelo titular</Text>
        <Text style={styles.contentText}>Dado e finalidade</Text>
        <Text style={styles.subSectionTitle}>1.2. Dados pessoais coletados automaticamente</Text>
        <Text style={styles.contentText}>Dado e finalidade</Text>
        <Text style={styles.sectionTitle}>2. Como coletamos os seus dados?</Text>
        <Text style={styles.contentText}>
          Nesse sentido, a coleta dos seus dados pessoais ocorre da seguinte forma:
        </Text>
        <Text style={styles.contentText}>Como se coleta</Text>
        <Text style={styles.subSectionTitle}>2.1. Consentimento</Text>
        <Text style={styles.contentText}>
          É a partir do seu consentimento que tratamos os seus dados pessoais. O consentimento é a manifestação livre,
          informada e inequívoca pela qual você autoriza a Exercise and Work Integrator a tratar seus dados.
        </Text>
        <Text style={styles.contentText}>
          Assim, em consonância com a Lei Geral de Proteção de Dados, seus dados só serão coletados, tratados e
          armazenados mediante prévio e expresso consentimento.
        </Text>
        <Text style={styles.contentText}>
          O seu consentimento será obtido de forma específica para cada finalidade acima descrita, evidenciando o
          compromisso de transparência e boa-fé da Exercise and Work Integrator para com seus usuários/clientes,
          seguindo as regulações legislativas pertinentes.
        </Text>
        <Text style={styles.contentText}>
          Ao utilizar os serviços da Exercise and Work Integrator e fornecer seus dados pessoais, você está ciente e
          consentindo com as disposições desta Política de Privacidade, além de conhecer seus direitos e como
          exercê-los.
        </Text>
        <Text style={styles.contentText}>
          A qualquer tempo e sem nenhum custo, você poderá revogar seu consentimento.
        </Text>
        <Text style={styles.contentText}>
          É importante destacar que a revogação do consentimento para o tratamento dos dados pode implicar a
          impossibilidade da performance adequada de alguma funcionalidade do site que dependa da operação. Tais
          consequências serão informadas previamente.
        </Text>
        <Text style={styles.sectionTitle}>3. Quais são os seus direitos?</Text>
        <Text style={styles.contentText}>
          A Exercise and Work Integrator assegura a seus usuários/clientes seus direitos de titular previstos no artigo
          18 da Lei Geral de Proteção de Dados. Dessa forma, você pode, de maneira gratuita e a qualquer tempo:
        </Text>
        <Text style={styles.contentText}>
          Confirmar a existência de tratamento de dados, de maneira simplificada ou em formato claro e completo.
        </Text>
        <Text style={styles.contentText}>
          Acessar seus dados, podendo solicitá-los em uma cópia legível sob forma impressa ou por meio eletrônico,
          seguro e idôneo.
        </Text>
        <Text style={styles.contentText}>
          Corrigir seus dados, ao solicitar a edição, correção ou atualização destes.
        </Text>
        <Text style={styles.contentText}>
          Limitar seus dados quando desnecessários, excessivos ou tratados em desconformidade com a legislação através
          da anonimização, bloqueio ou eliminação.
        </Text>
        <Text style={styles.contentText}>
          Solicitar a portabilidade de seus dados, através de um relatório de dados cadastrais que a Exercise and Work
          Integrator trata a seu respeito.
        </Text>
        <Text style={styles.contentText}>
          Eliminar seus dados tratados a partir de seu consentimento, exceto nos casos previstos em lei.
        </Text>
        <Text style={styles.contentText}>Revogar seu consentimento, desautorizando o tratamento de seus dados.</Text>
        <Text style={styles.contentText}>
          Informar-se sobre a possibilidade de não fornecer seu consentimento e sobre as consequências da negativa.
        </Text>
        <Text style={styles.sectionTitle}>4. Como você pode exercer seus direitos de titular?</Text>
        <Text style={styles.contentText}>
          Para exercer seus direitos de titular, você deve entrar em contato com a Exercise and Work Integrator através
          dos seguintes meios disponíveis:
        </Text>
        <Text style={styles.contentText}>Meio de contato</Text>
        <Text style={styles.contentText}>
          De forma a garantir a sua correta identificação como titular dos dados pessoais objeto da solicitação, é
          possível que solicitemos documentos ou demais comprovações que possam comprovar sua identidade. Nessa
          hipótese, você será informado previamente.
        </Text>
        <Text style={styles.sectionTitle}>5. Como e por quanto tempo seus dados serão armazenados?</Text>
        <Text style={styles.contentText}>
          Seus dados pessoais coletados pela Exercise and Work Integrator serão utilizados e armazenados durante o tempo
          necessário para a prestação do serviço ou para que as finalidades elencadas na presente Política de
          Privacidade sejam atingidas, considerando os direitos dos titulares dos dados e dos controladores.
        </Text>
        <Text style={styles.contentText}>
          De modo geral, seus dados serão mantidos enquanto a relação contratual entre você e a Exercise and Work
          Integrator perdurar. Findado o período de armazenamento dos dados pessoais, estes serão excluídos de nossas
          bases de dados ou anonimizados, ressalvadas as hipóteses legalmente previstas no artigo 16 da Lei Geral de
          Proteção de Dados.
        </Text>
        <Text style={styles.contentText}>
          Ou seja, informações pessoais sobre si que sejam imprescindíveis para o cumprimento de determinações legais,
          judiciais e administrativas e/ou para o exercício do direito de defesa em processos judiciais e
          administrativos serão mantidas, a despeito da eliminação dos demais dados.
        </Text>
        <Text style={styles.contentText}>
          O armazenamento de dados recolhidos pela Exercise and Work Integrator reflete o nosso compromisso com a
          segurança e privacidade dos seus dados. Empregamos medidas e soluções técnicas de proteção aptas
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'gray',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
