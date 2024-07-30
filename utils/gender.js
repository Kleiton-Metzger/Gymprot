export const getUserSex = genderCode => {
  switch (genderCode) {
    case '1':
      return 'Masculino';
    case '2':
      return 'Feminino';
    case '3':
      return 'Outro';
    default:
      return 'Não especificado';
  }
};
