import { FC, SVGAttributes } from "react";

export interface VerifiedBadgeProps extends SVGAttributes<SVGSVGElement> {}

const VerifiedBadge: FC<VerifiedBadgeProps> = ({
  ...componentProps
}: VerifiedBadgeProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect width="10" height="10" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_1387_344"
          transform="translate(0.00233645) scale(0.00233645)"
        />
      </pattern>
      <image
        id="image0_1387_344"
        width="426"
        height="428"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaoAAAGsCAYAAACM1uPrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACQQSURBVHgB7d1dWhvHuvbxu4UThPdBeEcQZQTBI4gYQfAIDCOwfeSQE4uTePk9MR6BYQQmI7AyApMRpDMD1sEKYiWodpVoeWPMh4S6W/VU/X/XpUsYY8cBqe9+6uOpQgBu9VPX9YqONs7P1esU+r4otO6cNsLv+ef18Otr/lh5zfOfY6cT/3ccd8518svfxbEA3KkQgE8G6259NNKGK7RVOH0fAumGIKqFC6HlQ8z/d373YXjsxjr+16goBeATggrZ8xVT3z/94B/96rFspQ/H4/Oxfnsw1pDKC7kjqJCdadXkP3ziK5mtJiummpT+MfSP37pdHQ1OihMBGSGokI2qcrISTrcZ+schoYVcEFRIWlU9PfXh9Mx4ON3kwD8O/bzWUECiCCokqaqeXiqOOac2lP6x5wPrQEBiCCokJcOAuqoUgYXEEFRIAgH1hVIEFhJBUMG0MAd1eqqXfv7pmfAF/3058vNzz9mbBcsIKpj1YtU99U+DRBdJ1G3gw2pPgEEEFcwJLY380zsxzDev0j92WCEIawgqmEIVtTg/FLi/tqY99mDBCoIKJlRzUe98QG0JdSj9Y5O5K1jQERC5sKJvNNJHQqpWPf/4w39vXwqIHBUVohaG+nxA7QtNOuh29ZyhQMSKoEKUqtZHb/yH20IbSjEUiEgRVIhOWNXnCh2F86CE1vjK9cRfEXZe/VUcCYgIc1SISrX0/AMh1b5wWrEb6z3zVogNQYVohEUT/mL5URcT/VieAWGFmDD0hyjsdt0Td3FkBeJx4OesdgQsGUGFpWNlX7z8XOHx2qo2WRGIZWLoD0sVhpgIqXj5ucKN0zN9CKswBSwJFRWWppoHGQjRo7LCMhFUWAqG++whrLAsBBVax8IJuwgrLANzVGjVz1+5DULKrjBnNRrpvYAWEVRoTdjMe97RB8G6vv9ZvhPQEoIKrfjUcYJzpFKxzaZgtIWgQitC7z7RcSI1gzDfKKBhBBUa92LVvaF3X6IK7Yd5RwENYtUfGsUy9CyU4ogQNIiKCo0J81KEVBZ6/sHiCjSGoEIjqpY7rPDLR3931T0T0ACCCo04PVVYEdYTsuEKvQlHtQioGXNUqJ2/WG2LoaBcld2uHtG5AnWiokKtqv1S7K/JV6+qpoHaEFSolXN6Kob8slYUesYQIOpEUKE21So/JtQRUFWhNgQV6sQqP0z1q7lKYGEEFWpRXZR6Av7PS04GRh0eCNEKb/L//ke98YpCi5qef3wbmrr6eaD16tdhTmj9lkav5TXPf1bPk0cd3QRYQIEb9EajyVDwQAu4/D4Yh9d7R73C6Zur74Xgyvuh/PT5Qif+z5z43zvxXxNWJH56H3TOdfLL38WxEC2Wp0eiutj3/Rtqw5e5347H6rfVaTwchuf/m6V/A//uLwLHxd8q53nj+n/7gX+iOSm+EIJhdVXfzbpc/fL7IPSH9K/JjTbfB8VFiP12n/cBmkNQLUm4S/R3m1v+wx/8o6/Ihs3cxd3nsX/z/t4pNHRjHV9XfVUXlj8E3GzPv3YG1/1GWB3oq6QN/xr7sc1QmlV4H3Q6Gp6P9duDsYYE13IQVC2qluxOg6kvY8Idp8LdptORv/AMw+derLqP/uJC92zc6HJVdfkGzYfAlsHzyUr/GPqK69fVrzVkY3M7CKqGVW/Mp9WbMqULelk9+gLu4F/7R9V8Ul9pOQih9eqv4khoDEHVkKp6CgsM+gKQujIcDupHG95y3En9CKoaXaqennHkOpCtA13My5VCLQiqGhBQAK4Kw53FP9pjAcbiCKoFEFAAZnAgKqyFEFT35OegXhJQAOZwIALrXgiqOVWLJMJZSz0BwHzKsODi1VmxL8yMoJpRGOY7PdU7X0FtCQAWU/rHJtXVbGhKO4MXq+6pD6k/CCkANen5xx9hCkG4ExXVLaiiALSgFNXVraiobhDmokYjfSSkADQsHDj6cXfVcejoDaiorhGG+vwLh8lOAK1yTvuvz4rnwmcIqkuqfVFv/IfbAoDlKMVQ4GcIqko4rqLq1fW9AGC5ShFWnzBHpU9nKn0gpABE4mLe6qFjjlwElX7+ym34ceGPYgMvgIiEY1HcWO9Zwp55UIW7lfOOr6RogwQgXoPcwyrbOardrnviLnpvAYAFAz9ntacMZRlUhBQAo7IMq+yCKsxJjVcmc1IAYFF2YZXVHFUIqTAnJQCwa5BbF4tsKqrpEnSxug9AAvzFe/vVqDhUBrIIKkIKQGqKQifFP9rM4aj7XIb+OOgQQFLCPis/3/6+uhFPWvJBVe0/6AsA0hNav71X4pIOKh9S2/5pIABIVOG08WLVvVHCkp2jmjSZdZPzpOg6ASB5KS+uSLmiojUSgHwU2k91virJoKrmpXoCgEyExRW6WDiWnOSG/qo7ij8EABnyc1bPX50VSZ1QnlxF5e8qkl8BAwA36uhlakOASQVVWOXn56U2BACZSnEIMJmgqu4gsj9gDAC8frU9JwkpVVRPxAIKAJjwo0tvBusuiZXPSQRVVU0NBACYCEOAo5GS6LKeSkU1EADgM76qeppCVWU+qKpq6okAAJ9JpapKoaIaCABwrRSqKtNBRTUFALdLoaqyXlERUgBwB+tVlfWg2hYA4FbWqyqzQVVtZusJAHCnUFXJKMsVFcN+ADCjUFX5G/y+DDIZVNUiir4AADOzWlWZDCp/Z5DEbmsAaFnf4qIKk0Hl7wp+FABgLtWiii0ZYy6oqjHWngAA92Fuft9iRbUtAMC9hDP7rA3/WQyqHwQAuJdq+M/UAbOmgophPwBYnCtszVOZCip/J2BuEhAAYlM4WwvSrA39MewHAIvrWZqnMhNUA7n1MAkoAMDC/vrLTtMEM0E16hJSAFCXYoWgqt3YEVQAUBc/T/W9jDATVEWH3n4AUBdLUyl2gsrpGwEAalF1U+/JAEur/noCANRmPLZRVRFUAJCplcLGddVEUFkpTwHAknGHoKpNZ0Xmzk8BgNgVRkaqTATV+JygAoC6ubG+lQEmgqoYE1QAULeisHFtNRFUrkNQAUADejLA5FH0AIB6WGhOayWoegIA1G40in/EiooKABA1ggoAMtYxsKqaoAKAjI0N7FMlqAAAUSOoAABRI6gAAFEjqAAAUSOoAABRI6gAIG+lIkdQAQCiZuOYD6cTAQBq1+3Gf321cXBiQVABQBMGJwVBBQCIVikDrBycSEUFADVzRqZVrBycSFABQM0KI9MqVob+SgEA6lbKABNB1R1RUQFAA/6UASaCaqD4V6UAgEGlDLC06q8UAKBOpQwgqAAgU92ujmWApaAyMZYKABaEFX8WNvsGZoJq7GwkP4AvlEJ0nKFrqpmgWnG82AGDdrojPfIXxSMhKq7Q7zLigYxwHSoqwJidf42Kg8lHZ3r8U9cN/EcvhSh0xnZu/s1UVP4FX1pp9wHgUkhV/K8H/mlPiIKvqBj6a4Kf/PtVAKJWOD2/GlJTVVjtCEtnZcVfYCqoWFABRG/v1Vmxf9sXhBDrnE/mrRghWZKwkMLKir/AVFB1CiZkgYjtVRXTnX75uzj2IySPxIrApSgMDfsFpoKKeSogWjOH1FR4P/unTRFWy/CbDLF3cGLH1jcYSJ2flH87b0hNTcPK0p6eFPihVyqqRhlaUglk4PD1afFMCwhhtXY2qayGQhvKMPQqQ8wFlWOYAIhC2DDqQ2ZbNQgnJPi/K4TVodC0UsbYq6gALF0IqbVV9VWzKvjYa9WsnowxF1SdQhsCsExl4bTV1PJmNgY3rvdT15nqEFLICP+N7funHxRGCQAsS+kfm9UiiEbRcqlxQ110ECkVueiDqgqo8GLtC8AylWoppKb8+3/bP70TmjTwP9OoK9hog2qw7tZPT/WyKLTQiiIAiwv7F1fG2lzGarHdr93WuNA7fy1YF5pS6mIv3IEiFGVQ7T70L8xzXphALELLo2Uuaf75K7cxXtF7GVwIYIm/5h65i16NpSISVVBVVVQIqC0BiMVODHfafhiw558+iLBqVDj5V+O7eza2KZqgCnNRPsnfU0UBUZm7NVKTCKtWHXS7eh5D89qlBxVzUUC0ogqpKcKqVaVaXkBznaUGVXjBOT8mWjh9LwAxiTKkpgbyN7ir+lCwr7Jxk6HAQjuv/iqWdnrF0jb8hgUTfqjvIyEFROcw5pAKQsulqj8gLZca5q/T626s98vcJLyUiqr6Hx4IQGyGVc89M16sun1/1/9UaJwPrf3XZ8VztazVoArzUaOR3vgPtwUgKtP+fZZOfp2ii0Wrht2uHrf5OmktqJiPAqJWKoJJ80UQVq0q1eLrpZWgYpUOELVSxkNqirBqVamWXjeNBxUhBUStVCIhNUV/wFaVauH102hQhbYn553JElI28QKRWWb/vqZx7WlVqYbDqrHl6bxQgLilGlLBeEUnk/0/aEPPf68/hmu+GtJIUIXhPkIKiNpOqiHFdEP7JnutHuhD9b2vXe1BNX2REFJAtKI9zmFRYQtMWF0sQqp1Iaz8UyNhVescFXcyQPSibo20iEnf0DMN2QKzdKVqnrOqraIKLxIRUkDMkg2pIDQTIKSi0FPNlVVtQeVfJBxqBkTKD4e9TTmkXqw6Ot7EJTR4eF8VMAurJaiq3n19AYjR4evTItljdML1h2OC4uOr242qZd7CFg4qfycTmkEOBCA6foL7yFdS20oUDa6jt11H1/WFgqoagxwIQHQmTWbXtKNEcZNsxmB31S1U8d571V/VCf2jmJcCYlQqsdZIl+123RMnHQgmhM3XxT/332B+74oqHB8vQgqIUamEQyp0QCCkbAl7rMYr919cca+gCk0fmbwEolQq4ZCadr0RLOrdd3HF3EN/bOoF4hSazPobyEcph5S49phXOD1/dVbsz/Nn7lNRDcQLBYhOaDJLSCF6Hb2cdzPwXEFVnfPyRABik2yTWbrepKXqCTjXeWHzVlScnAlEJgylpNxkNvTvEyGVmv48S9ZnDqpq01ZPAGKyN+94vyX070uYHwKcdRXgTEHFxl4gSkk3maV/X9rCEGC1zelOs1ZUAwGIRupNZunfl4fwM/Y/6/5dX3dnUFXVFAsogHgk32RW3Bzn5M6qapaKaiAAUQj9+7rddCsN+vdlqX9XVXVrUIVWJaKaAmJRrq2qPzgpTpSg3Yduyw8FJbswBLe6taq6NajGK4wRA5Eo/WMz1ZAKN8Xj8/n21iApt1ZVNwYVc1NANEol3r8vNCz11VQtp8HCrBurqtsqqoEALFXo36fEQ0p0ncCFG6uqa4OKagqIA/37kJlrc+emimogAMuWdP8+V+hIhBQu8cO/W9d1q7gpqH4QgKVJuX9fMBr5OSlaI+GK0K3Cvza+WMT3RVDtfu22xF0OsExJ9+/zQ35hdV9fwDV8VfX06ue+CKrxCr21gCVKun9f1XViW8ANQlV1dVHFZ0EVJjd9Of6jALQuh/59Yv4bM/Dvha3Lv75aUfUFoHX+LvKI/n3ABR9MTy4vqrgaVCxJB1oW+vetrWlHidrtunBdGQiYUbWoYmP6609BNdAkvfoC0KbSD7dvpdwayUkHAub3qXD6FFRnXxNSuFB1QyiFppVKvOvEeWeyoReY2+U9VZ+CynU+n7xCtkr/AnnkL57f+cB6KzSlVAatkejfh/u6PPzXufRJNt9lLsyV6NLF8/XZZHJ/T6gV/fuA2UxX/02CarIsvfi/iSvkZzKhv6r+1YtntVyasKpRyv37qqEaQgq1mHYvmQRVMSakMje87UC+EFb+Rua5UIdk+/cFp2caipBCTaYF1CSoxgULKTJ26IPozgP5Xp1OWvoku4S6JXsp9+8LrZHo34c6VV0qehcVVcGLK1MhpLZn/eJwkfXV9+NqjgXzoTUScD8XQeUvPAz95WeukJp69d/iKMyxEFZzySGkBgKa0euEjb4sIc3OvUJqKsyxEFYzOySkgPvzw8nrnVGXaiozC4XUVAirsN9KbAy+zbCO73WsaI2ENjhfSIWhv56Qi8M6L5zVEutNEVZfCMv9u109VqLCMQy0RkJbCKp8HDZxd09YXSv9/n1O7wW0gIoqH4dNDkERVp8plXjXifGK3jOvjbb4m75vQlB9K6TssI15EsJqohStkYDadcKGKiFVh21O5uccVmEFZOdcjwkpoH4dSvhktRpSU7mGVWcl3dZIoX+fnyc4EiGFJaGiStNSQmoqw7DaefVXcaREnZ6K1khYKiqqxPgbj6MY9u5kFFZJ9+97sereFAVn1WG5OkIyJkd1rMXTODaDsEq+NZIPqWcCloygSsT0PKnY9u4kHFb07wNaQlAlINaQmkowrJLu3+eH+56KkEJECCr7THRBSCWswk1B0v37HrotP9y3LyAiHTpgm1bK0AZT62E1rVyVqNAaaXyudwIiE1b9EVQ2lTLYBcFwWCXdv4/WSIgZQ382lTLcqsdgWJWiNRKwNCGoSsGMaqjW/EXTUFiVIqSApQpB9adgRjhZN5WLZuxhlXr/PlojwYg/WUxhiJ8jeZ5aP7mYwyrl/n0BrZFgRccx9GfF3quzIsllwzGGVbgpSLl/nx/ye0drJFjRWXEElQXdbtp7WyILq2RvCoKq68S2ACM6rqNkhzZSMhrpjRIXSVjRGgmIS9lJdaI4QdvVRSZpSw6rpEOK1kiwaDzWyWQflXNUVUYMCKvGJN2/b7frntAaCRZ1OlVQ+Rfw74IVhFXNUu/fF1ojOelAgE3lJKjGVFTWDHZXXfLnBLURVqn37wsbes87kw29gDmhxV+4DkyC6sEDDQVT/AX2TRjOUeIaDqvk+/f5pw/074NV02mpSVD98p/imI2/9oThHMLq3krRGgmImqumpT41pfV3XQz/GURY3UuphEMqtEYSIYUEuPOL0b5PQeXnqX4VTCKsZpd6/77g9Gzy5u4JMO7hwytB1bloTgmrCu2H1V1K3KJh5UcOHqfcv2/SGon+fUjDcDp//CmoqgtAKZjkK4V190AfCKtb7fg/O1SiaI2ExBxOP+jc9Buwh7C6Veg6caBE0RoJCRpOP+jc9BuwibC6Fv37AEsK/Xp5HvmzoKqGRUrBNMLqM0mHVLWIZiAgJe7zNROda76E4b8EEFYTSYcUrZGQqPLqMP0XQdUd0bgyFZmHVdJNZsPPlNZISNTw6ie+CKqBJssBh0IScgwr///8NuUms6HrxHhF72mNhETtXf1Ecd1X+TdCX+JuLSWhuWPxjzZT3kOUA1ojIXFDf5O5efWT181RsagiQTlVVqkipJC68Vhvr/t855Y/w6KKxBBWdoX+fe6ie0xPQJrK///f4toOSTcGVVhUQUf19BBWNp2eitZISN3eTb9xY1CFRRV+XuOtkBzCypYXq+6Nfy9uCUhXeVvnmNuG/qiqEkZY2RC6TviQSv40Z2Rv77bfvDWoqKrSRljFjdZIyER5Vx/OW4MqqDYAl0KSCKs4+eG+pyKkkIGio+d3fc2dQVVtAN4TkkVYxWX3odvyIxl0iIEycPDqr+LOsxDvDKqgKsuGQrIIqziE7//4XO8E5GGmImimoJp84fnd5RlsI6yWi9ZIyMze5aM8blNoDn7cfN+/iZ4KSaPdUvvoOoHMhAUU3836xTNXVMHa2WRytxSSRmXVLkIKGdqc54vnCqpqYcWOkDzCqh20RkKGZh7ym5orqILQsDYcoyAkj7Bq3mjk56RojYR8lPc5J27uoArCEKC/iDF/kQHCqjl+yC+s7usLyMdcQ35T9wqqqmPFY9or5YGwql/VdWJbQCb8yMHzeYf8pu4VVEH4D3Y6bATOBWFVH1ojITd+Hvbtq7Pi3pvY51qefh2WrOeFpeuLIaSQobmWol/n3hXV1Ouz4hnzVfmgsrq/3a57IkIKeSl1z3mpyxYOqiDMV4n9VdkgrOYXvldOOhCQiWoNw+Z956UuqyWoqn/IJosr8jENq9BAVbhV2NB73pls6AWy0VnRTh0hNfm7VJPwD1oZE1Y5mYTVWO+rIS1cY9p1gv59yElY4TdLV/RZ1RZUQZhg929ImtdmJgxpEVZfojUSMrW3yAq/6yy86u86/g267Z84qiAz/sW0/WpUHAqT1kijkT6KkEJe9u7TeeIutVZUU9X5VfQEzAyV1YUQUqdnk/PbegLy0UhIBY0EVUBY5YmwmvTve0P/PmSmsZAKGguqgLDKU85h9WLVvRGtkZCXRkMqaGSO6qqwhyQsz2XlU15ym7Oi6wQytFMVJI1qtKKaqlYDPhKbgrMSKqvq4p08Qgo5ubSZ90AtaKWimmK5brYG/gWdbANjP9z31N+I1bocF4hYqZo6TsyqlYpqKvyPdUeTyoolzHkZpFpZhc4chBRy4Qr9rpZDKmi1orrMX7gG/imLYSF8klRlxdwrMnPY7erZ4KRovfvQ0oIq8GHV18XG4J6QiyTCimFsZKbxlX23WWpQBdUbniO582I6rAgp5CIsmginY/j361BLtPSgmmIoMDsmw4qQQi7CfFThtNX2fNR1Wl1McZuqrAynQJZCDswtsAitkfybN3SE7glIWDg6fm1V/RhCKoimorqM6iorZior/7oMlVRfQKLCUF84R6rOIzrqEGVQBcxdZSX6sPKvx/Ba3BaQrqFU32GHdYo2qKZ219wzn/JPxXBL0vzPeP/1WRHlWWZ0nUDKJlVUA2dI1Sn6oAqq6mrgHxzOl7YDfzcXVRNjQgqJGyrSKuoyE0E1VR3IGC4cPSFV0YQVIYWEDXWxN2ooA0wFVfDz/7iN8fnk5FSka+lhFY4pCU11BaRn6N9fmzIkmuXps/IhRbua9G37ucn3YTm4liC0RiKkkLCejLEXVE4bQvL8BO/W6Zk+tB1WYT409O8TkCiLvSnNBVWnIKhyUfibkjbDatp1giazSJm/CVyvXutmmAsq/03+XsjGNKyafmPRGgmZ6csQU0E1kFsvqKiyU1wM9zYWVlXFRkghG87YddRUUJ19TZeKjPXUUFj5im0oQgoZ8Td/P8oQU0E1LgiqzPVUc1iF1kgFw8nIT8/SPJW1OaofhNz1VFNYvVh1b0T/PuSrLyNMBRXzU6j0tGBYha4T/vX0TECmLM1TmQmq6th6YKrng+Zj2JyrOdEaCZi0JerJCDNBxUZfXBX2g7gH+jBPWIXWSCKkAP8GsjM3ayaoLKU/2hPCaryij1UA3Wr3oduiNRLwSW9ZbcrmZWeOqkNQ4WYhgHZX3Y1zTqHqGp9PDuIEUPnvf2xcV+0E1VjfCriFnxx+U80/fSYsuvBV13taIwGf+6cgqOrWE3C3weWwojUScLMVI0H1QEZwN4w5DHbX3Ebxj/bG0nsRUsC1xkamVEwElbVOv1i+cEyIW9GWANyocPpGBlgZ+usJAFCvQv9PBpg75gMAUA9nZJEaFRUAZMrK3D8VFQAgalRUAJCvngygogIARI2gAgBEjaACgIxZ2KfKHBUAIGpUVACAqBFUAICoEVQAgKgRVACAqBFUAICoWQmqUgCA2nW7OlHkqKgAIGODk4KgAgBgESaCauziL00BwJqisHFtNRFUHSPfTACwxBkpAkwEVTEmqACgAaUMMBFUrkNQAUDtCv1bBrA8HQAy5aio6tMdUVEBQN06Y4KqNgMVJ1Ym/QDAinNHUNXKyjJKALDiAUFVL1fodwEAavPL38WxDLDTmcLIWCoAGDGUEZaG/kwkPwBYYGmUylKvv6EAALVw51RUtfvXqChZ+QcA9Xj4kKBqyqEAAIsaWjjeY8pUUPl5qiMBABZSOP0qQ0wFVXekY4b/AGAxxdjWnL+poAodKnxVZepOAAAiU1rZPzVl8YTfAwEA7msoY8wFFcN/ALAQc4vSzAVVGP4Tq/8A4D7Kf42KoYyxOPTH6j8AuIfC6a0MMhlU4Y6A4T8AmI8zepNvMqgCX1WZvDMAgKUo9Gvo8CODzAZVd6R9qioAmJHTvowyG1TsqQKAmZlcRDFlNqgqBwIA3GVPhhUy7qeu++Cf+gIAXCdUU9/JMOsVVWD6TgEAGmb+Gmm+ogqoqgDgWuarqSCFiiqgqgKALyVxbUyiogqoqgDgM0lUU0EqFVWwIwDAVDIjTckEVdhx7Yz2sQKAmh34a+KBEpFSRaW1Mw38UykAyFtS8/ZJBdWkW8VYzwUA+dqz2tPvJsksprjsxap7XxTaEgDkJZkFFJclVVFN+SHAsLCiFADkZVMJSjKoqlOAWQUIICfJDflNJTn0N+WHAPf9EOBTAUDCnNPR67PisRKVZEU15X9wz/zTUACQrtLfkCe9iCzpoKowXwUgWZ1zPU51yG8q+aAKP8Dwg+Q0YACpKZye//J3cazE5VBRKfwgUy+NAWRn79VZYfZ4+XkkvZjiqp+6buCfXgoADEt98cRVWVRUU34YcCCOBAFgmCv0+9paXttvsqqopqisABhVdrt6NDgpsppzzzKoAsIKgDGlf2ymvsLvOtkGVUBYATCiVKYhFWQ1R3UVc1YAYhfmpMJwX64hFWQdVAFhBSBiw7VV9XObk7oq66G/y/ww4LZzelMUWhcALJmvpN6+Pp20gcseQXWJD6uef/rgHz0BwJKEjhO5bOadRfZDf5dVY8DhPJehAKBlVau3TULqc1RUN2BFIICWDf1jJ+dFEzchqG7x81duY7yi92IoEECDmI+6HUN/twjNbLsjPfLl+FsBQP1K/9gkpG5HRTUjPxTY90/vRHUFoAahilpb1SD3peezIKjmxNwVgAUN/WPPz0UNhZkQVPdQLWMf+McTAcAMwoq+cC6eD6gDYS4E1QIILAB3qQLqbberfYb57oegqkE1fxWGA/sCABFQdSKoakSFBYCAqh9B1YBLgfWDWCUI5GIoFkk0gqBqWNXs9kd/h7UlAKkp/eOQ6qlZBFVLqiqrr4thwb4MqoY0jv2Hv+ni7rH0n/tIx3ncpejocfG3yvGKNqobtw3ZHW0o/ePQP4ZUT+0gqJZgsO7Wz/5S33UmVVa0w4NXg8nfNR5fvWvcXXPPwvEoAm524C/oO1c/WbUoiz64qkaxQ+ffB51CR/Tiax9BFYFQbRVjhTdtv3D6Xhdv2J7aVYZHOE3UjVU+GGsYWkjN8gf9vz8cjdIXcL3vZrm4h+Dyr7/e9H3gA2K9CrDWVKFUhhu0sdPv87wP0ByCKmLVHWcYVuuFh38Tr/s38De6FGLVm/m2obey+rpQHZ34v+PfxfTNOPa/7ujYV0oni4yvV8vzPwj40l51iva9VcPm4WZu/dwHWefi9f7tNa/93k1/x/T1X/2yrJ7/VPU+8O+J8uv/Uck8U5wIKtTCX0wOxLJ8fK70N0GPuPhjUXRPR10G1bAJMLVHSKEOBBVqEeYgwiZHAZp0Bj+mpx3qQlChNt2RwvHZpZA9P+fzWEBNCCrUZqDJMM+OkLs9lnCjTgQVahU2QHIictbCAop9ATUiqFC7tbNJn8NSyNEmCyhQN4IKtQtDgJ1z5igyxJAfGsE+KjSG9kr5CB1NXp8WrXaRQD6oqNCYV6fFvg+qIyF1ZeE4HQDNIajQKD9fFVYBlkLKdhjyQ5MIKjSqWrK+SdeKZHFQIBrHHBVaQePa9Ph5qbd+XuqZgIZRUaEV4a67KPRcSMWQkEJbCCq0Jiyu8E97gnVhUy/bD9Aahv7Quherbt9XV08Fi0r/2GTxBNpEUGEpOL/KpFKEFJaAoMLSEFamlCKksCQEFZaKsDKhFCGFJSKosHSEVdRKEVJYMlb9Yen8RXBbrAaMUSlCChEgqBAFfzEciLCKRmgy2+3qESGFGBBUiEYIKzYFR+FwbVV9zpVCLJijQnR2v3Zb40LvfGitC23bq6pbIBoEFaL0U9f1dNEbsCc0LjQN9sMre6/OCo6RR3QY+kOUqrmRTc6zakW5MtYmIYVYUVEher66Gvinl0IThqFvH/NRiBlBBRN+/sptjFf0XgwF1qZwek4VBQsY+oMJv/xdHPunTf84FBZVds71iJCCFVRUMMcPBW7rYiiwJ8wlHHa4tqoBQ32whKCCSdWqwIFovTSTsIHXD/U949h4WERQwTSqq9uFZeeFr6LYGwXLCCokoVoZGKqrnjB10O3qOcN8sI6gQjIYDvxkqIsOE0MBCSCokJxpYPlhrx8za8M0FAGFBBFUSFYVWH0lPIcV5qDU0eHKPzqolvADySGokAUfWn3/tK10hgWHY6dfH67pgDkopI6gQlYG6259NNJWNSy4JVuG/vGbfxxwThRyQlAhWyG0zv5S33UmwfW9D64NRaRaWh6a8v7W7eqIygm5IqiAyqXgCoH1gw+KjbYWY0zmmsLR7x39VjiFuaYhVRNwgaACblENFYbg6lWPb8OzD5b1KsR6M/5V5aXn0hX6txurXHH+446OCSXgZgQVUJNqleEnfrjuhOE6YHH/CwRGuXgv18uFAAAAAElFTkSuQmCC"
      />
    </defs>
  </svg>
);

export default VerifiedBadge;
