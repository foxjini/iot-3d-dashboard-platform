# Raspberry Pi Pico 2 W - CircuitPython 1분 퀵 셋업 가이드

학생 여러분, Thonny나 복잡한 프로그래밍 툴을 설치할 필요가 없습니다!
CircuitPython은 일반 USB 메모리(외장하드)를 다루듯 파일만 복사하면 즉시 실행됩니다.

## 1. 초기 펌웨어 설치 (최초 1회만)
1. Pico 2 W의 하얀색 **`BOOTSEL` 버튼을 누른 채로** PC의 USB 포트에 연결합니다.
2. PC에 **`RPI-RP2`** 드라이브가 나타납니다.
3. [CircuitPython 공식 사이트](https://circuitpython.org/board/raspberry_pi_pico2_w/)에서 Pico 2 W용 `.uf2` 파일을 다운로드하여 `RPI-RP2` 드라이브로 드래그 앤 드롭합니다.
4. 잠시 후 보드가 재부팅되면서 **`CIRCUITPY`** 라는 새로운 USB 드라이브가 마운트됩니다.

## 2. 파일 복사 및 Wi-Fi 설정
1. 이 폴더에 있는 파일들을 `CIRCUITPY` 드라이브에 복사합니다:
   - `code.py` -> `CIRCUITPY/code.py`
   - `settings.toml` -> `CIRCUITPY/settings.toml` (메모장으로 열어 본인 교실/집의 Wi-Fi 이름과 암호 입력)
2. `lib` 폴더에 [Adafruit Library Bundle](https://circuitpython.org/libraries)에서 다음 라이브러리를 복사합니다:
   - `adafruit_dht.mpy`
   - `adafruit_motor/`
   - `adafruit_httpserver/`
   - `adafruit_requests.mpy`

## 3. 실행 및 확인
- 파일을 저장하는 즉시 Pico 2 W가 자동으로 코드를 다시 실행합니다.
- Wi-Fi가 연결되면 시리얼 모니터 또는 공유기 관리 페이지에서 확인된 IP 주소를 웹 대시보드 상단에 입력하고 **[하드웨어 모드]**로 전환하세요!
