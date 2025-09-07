# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ldd /app/libleptonica-1.82.0.so
ldconfig -p | grep -E 'lept|png|jpeg|tiff|webp|openjp2|gif|z'

# 1) Base tools + tesseract + build toolchain
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    hunspell \
    hunspell-en-us \
    autoconf automake libtool pkg-config g++ make wget \
    # 2) Leptonica runtime dependencies (critical):
    libpng16-16 libjpeg62-turbo libtiff6 libwebp7 libopenjp2-7 libgif7 zlib1g \
    && rm -rf /var/lib/apt/lists/*

# 3) Build & install Leptonica 1.82.0
WORKDIR /tmp
RUN wget http://www.leptonica.org/source/leptonica-1.82.0.tar.gz \
    && tar -xvzf leptonica-1.82.0.tar.gz \
    && cd leptonica-1.82.0 \
    && ./configure --prefix=/usr --libdir=/usr/lib/x86_64-linux-gnu \
    && make -j"$(nproc)" \
    && make install \
    && ldconfig \
    && cd .. && rm -rf leptonica-1.82.0*

# 4) Sanity check the installed lib and its deps
RUN set -eux; \
    test -f /usr/lib/x86_64-linux-gnu/liblept.so.5; \
    ldd /usr/lib/x86_64-linux-gnu/liblept.so.5

# 5) Provide the exact filename Tesseract.NET asks for, in two places
#    a) System lib path
RUN ln -sf /usr/lib/x86_64-linux-gnu/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

#    b) App folder (fallback search path we’ll also expose via LD_LIBRARY_PATH)
WORKDIR /app
RUN cp /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/libleptonica-1.82.0.so

# 6) Make sure the loader sees all locations (include /app explicitly)
ENV LD_LIBRARY_PATH=/app:/usr/lib:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

# Bring in your app
COPY --from=build /app/publish .

# Tesseract data + Hunspell dictionaries
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
