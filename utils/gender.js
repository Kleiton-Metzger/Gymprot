export const getUSerSex = gender => {
  if (gender === '1') {
    return 'Masculino';
  } else if (gender === '2') {
    return 'Feminino';
  } else {
    return 'Não informado';
  }
};
