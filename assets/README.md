# Assets - Pro Wrestling Sim

## Arquivos

- `icon.png` - Ícone principal (256x256 PNG)
- `icon.ico` - Ícone Windows (múltiplos tamanhos)
- `icon.svg` - Ícone vetorial (escalável)

## Uso

### Electron (main.js)
```javascript
icon: path.join(__dirname, '../assets/icon.png')
```

### Windows Installer (NSIS)
```
!define MUI_ICON "assets\icon.ico"
```

## Customização

Para customizar o ícone:

1. Editar `create-assets.py`
2. Modificar cores:
   - `bg_color` - Cor de fundo
   - `accent_color` - Cor de destaque
   - `text_color` - Cor do texto

3. Executar: `python3 create-assets.py`

## Requisitos

- Python 3.7+
- Pillow (PIL)

## Instalação de Dependências

```bash
pip3 install Pillow
```
